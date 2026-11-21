import { useRef, useState } from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap'
import { DATA_SOURCE, PrefixStorage } from '../constants'
import GeneriranjeJedinicaMjere from '../pages/jedinicaMjere/GeneriranjeJedinicaMjere'
import GeneriranjeSastojaka from '../pages/sastojci/GeneriranjeSastojaka'
import GeneriranjeKategorija from '../pages/kategorije/GeneriranjeKategorija'
import GeneriranjeRecepata from '../pages/recepti/GeneriranjeRecepata'
import GeneriranjeOperatera from '../pages/operateri/GeneriranjeOperatera'
import { kategorije } from '../services/kategorije/KategorijaPodaci'
import { jediniceMjere } from '../services/jedinicaMjere/JedinicaMjerePodaci'
import { sastojci } from '../services/sastojci/SastojakPodaci'
import { operateri } from '../services/operateri/OperaterPodaci'
import { recepti } from '../services/recepti/ReceptPodaci'
import OperaterServiceFirebase from '../services/operateri/OperaterServiceFirebase'
import KategorijaServiceFirebase from '../services/kategorije/KategorijaServiceFirebase'
import SastojakServiceFirebase from '../services/sastojci/SastojakServiceFirebase'
import ReceptServiceFirebase from '../services/recepti/ReceptServiceFirebase'
import JedinicaMjereServiceFirebase from '../services/jedinicaMjere/JedinicaMjereServiceFirebase'

const KARTICE = [
    GeneriranjeJedinicaMjere,
    GeneriranjeSastojaka,
    GeneriranjeKategorija,
    GeneriranjeRecepata,
    GeneriranjeOperatera,
]
// Baca grešku ako servis vrati { success: false }
function provjeri(rezultat, opis) {
    if (rezultat && rezultat.success === false) {
        throw new Error(`${opis}: ${rezultat.message || 'nepoznata greška'}`)
    }
    return rezultat
}
// Vraća novi (Firebase) ID za stari ID iz memorije
function nadiNoviId(mapiranje, stariId) {
    return mapiranje.find(m => m.idm == stariId)?.idf ?? null
}
export default function GeneriranjePodataka() {
    const [poruka, setPoruka] = useState(null)
    const [radi, setRadi] = useState(false)
    const otkazi = useRef(false)

    const jeMemorija = DATA_SOURCE.trim() === 'memorija'
    const jeFirebase = DATA_SOURCE.trim() === 'firebase'

    function provjeriPrekid() {
        if (otkazi.current) {
            throw new Error('Prekinuto od strane korisnika.')
        }
    }
    // Prenosi popis u Firebase i vraća mapiranje starih ID-ova na nove
    async function prenesi(popis, servis, opis) {
        const mapiranje = []

        for (const e of popis) {
            provjeriPrekid()

            const { id, ...ostatak } = e
            const fb = provjeri(
                await servis.dodaj(ostatak),
                `${opis} ${ostatak.naziv}`
            )
            mapiranje.push({ idm: id, idf: fb.data.id })
        }
        return mapiranje
    }

    // ===================== MEMORIJA -> LOCALSTORAGE =====================
    function handleMemorijaULocalStorage() {
        if (!window.confirm('Presipati sve podatke iz memorije u localStorage? Postojeći podaci bit će zamijenjeni.')) {
            return
        }
        setPoruka(null)

        try {
            localStorage.setItem(PrefixStorage.JEDINICE_MJERE, JSON.stringify(jediniceMjere))
            localStorage.setItem(PrefixStorage.KATEGORIJE, JSON.stringify(kategorije))
            localStorage.setItem(PrefixStorage.RECEPTI, JSON.stringify(recepti))
            localStorage.setItem(PrefixStorage.OPERATERI, JSON.stringify(operateri))
            localStorage.setItem(PrefixStorage.SASTOJCI, JSON.stringify(sastojci))

            setPoruka({ tip: 'success', tekst: 'Uspješno presipano u localStorage!' })
        } catch (error) {
            // Najčešće je prekoračen limit localStorage (oko 5 MB zbog slika)
            setPoruka({ tip: 'danger', tekst: 'Greška pri presipavanju: ' + error.message })
        }
    }
    function ocistiLocalStorage() {
        if (!window.confirm('Obrisati podatke iz localStorage?')) return

        setPoruka(null)

        const kljucevi = [
            PrefixStorage.JEDINICE_MJERE,
            PrefixStorage.KATEGORIJE,
            PrefixStorage.SASTOJCI,
            PrefixStorage.RECEPTI,
            PrefixStorage.OPERATERI,
        ]
        kljucevi.forEach(k => localStorage.removeItem(k))

        setPoruka({ tip: 'success', tekst: 'localStorage očišćen.' })
    }
    // ===================== MEMORIJA -> FIREBASE =====================
    async function handleMemorijaUFirebase() {
        if (!window.confirm('Jeste li sigurni da želite pretočiti iz memorije u firebase?')) {
            return
        }
        otkazi.current = false
        setPoruka(null)
        setRadi(true)
        try {
            // 1. Operateri 
            for (const e of operateri) {
                provjeriPrekid()
                const { id, ...ostatak } = e
                provjeri(
                    await OperaterServiceFirebase.dodajBezHash(ostatak),
                    `Operater ${ostatak.email}`
                )
            }

            // 2. Kategorije, jedinice mjere i sastojci (trebaju nam novi ID-ovi za recepte)
            const mapKategorija = await prenesi(kategorije, KategorijaServiceFirebase, 'Kategorija')
            const mapJedinica = await prenesi(jediniceMjere, JedinicaMjereServiceFirebase, 'Jedinica mjere')
            const mapSastojak = await prenesi(sastojci, SastojakServiceFirebase, 'Sastojak')

            // 3. Recepti (povezivanje starih ID-ova s novima)
            for (const e of recepti) {
                provjeriPrekid()

                const { id, ...ostatak } = e

                ostatak.kategorija = nadiNoviId(mapKategorija, ostatak.kategorija)
                if (ostatak.kategorija === null) {
                    console.warn(`Recept "${ostatak.naziv}": kategorija nije pronađena`)
                }

                ostatak.sastojci = (ostatak.sastojci || [])
                    .map(s => ({
                        sastojak: nadiNoviId(mapSastojak, s.sastojak),
                        kolicina: s.kolicina,
                        jedMjere: nadiNoviId(mapJedinica, s.jedMjere)
                    }))
                    .filter(s => {
                        const ispravan = s.sastojak !== null && s.jedMjere !== null
                        if (!ispravan) {
                            console.warn(`Recept "${ostatak.naziv}": preskočen neispravan sastojak`)
                        }
                        return ispravan
                    })

                // Servis recepata baca iznimku u slučaju greške
                await ReceptServiceFirebase.dodaj(ostatak)
            }

            setPoruka({ tip: 'success', tekst: 'Uspješno presipano u Firebase!' })

        } catch (error) {
            console.error('Greška pri presipanju:', error)
            setPoruka({
                tip: 'danger',
                tekst: 'Došlo je do greške prilikom sinkronizacije: ' + error.message
            })
        } finally {
            setRadi(false)
        }
    }

    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <h2 className="text-center mb-4">Generiranje podataka</h2>

            <Row className="g-4 align-items-stretch">
                {KARTICE.map((Kartica, i) => (
                    <Col xs={12} md={6} key={i}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body>
                                <Kartica />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {jeMemorija && (
                <>
                    <hr className="my-4" />
                    <h3>Presipavanje podataka</h3>
                    <p className="text-muted">
                        Koristite ove opcije za kopiranje podataka iz memorije u drugi izvor.
                    </p>

                    <Row className="mt-3">
                        <Col md={6}>
                            <Button
                                variant="danger"
                                onClick={handleMemorijaULocalStorage}
                                disabled={radi}
                                className="w-100 mb-2"
                            >
                                Iz memorije u localStorage
                            </Button>
                        </Col>
                        <Col md={6}>
                            <Button
                                variant="danger"
                                onClick={handleMemorijaUFirebase}
                                disabled={radi}
                                className="w-100 mb-2"
                            >
                                {radi ? 'Radim...' : 'Iz memorije u firebase'}
                            </Button>
                            {radi && (
                                <Button
                                    variant="secondary"
                                    onClick={() => { otkazi.current = true }}
                                    className="w-100 mb-2"
                                >
                                    Prekini
                                </Button>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Button
                                variant="outline-secondary"
                                onClick={ocistiLocalStorage}
                                disabled={radi}
                                className="w-100 mb-2"
                            >
                                Očisti localStorage
                            </Button>
                        </Col>
                    </Row>
                </>
            )}

            {jeFirebase && (
                <>
                    <hr className="my-4" />
                    <h3>Firebase</h3>
                    <p className="text-muted">
                        Podaci se generiraju direktno u Firestore kroz kartice iznad.
                        Pazite da ne generirate iste podatke više puta.
                    </p>
                </>
            )}

            {poruka && (
                <Alert variant={poruka.tip} className="mt-3">
                    {poruka.tekst}
                </Alert>
            )}
        </div>
    )
}
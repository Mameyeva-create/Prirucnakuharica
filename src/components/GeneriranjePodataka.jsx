import { useState } from 'react'
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
export default function GeneriranjePodataka() {
    const [poruka, setPoruka] = useState(null)
    const [radi, setRadi] = useState(false)

    const jeMemorija = DATA_SOURCE.trim() === 'memorija'
    const jeFirebase = DATA_SOURCE.trim() === 'firebase'

    // ===================== MEMORIJA -> LOCALSTORAGE =====================
    function handleMemorijaULocalStorage() {
        if (!window.confirm('Presipati sve podatke iz memorije u localStorage? Postojeći podaci bit će zamijenjeni.')) {
            return
        }
        setPoruka(null);

        try {
            // Slike u base64 su velike (limit localStorage je oko 5 MB), pa se ne kopiraju
            const receptiBezSlika = recepti.map(({ slikaBase64, ...ostalo }) => ostalo)

            localStorage.setItem(PrefixStorage.JEDINICE_MJERE, JSON.stringify(jediniceMjere))
            localStorage.setItem(PrefixStorage.KATEGORIJE, JSON.stringify(kategorije))
            localStorage.setItem(PrefixStorage.RECEPTI, JSON.stringify(receptiBezSlika))
            localStorage.setItem(PrefixStorage.OPERATERI, JSON.stringify(operateri))
            localStorage.setItem(PrefixStorage.SASTOJCI, JSON.stringify(sastojci))

            setPoruka({ tip: 'success', tekst: 'Uspješno presipano u localStorage!' })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri presipavanju: ' + error.message })
        }
    }
    // ===================== MEMORIJA -> FIREBASE =====================
    const handleMemorijaUFirebase = async () => {
        if (!window.confirm('Jeste li sigurni da želite pretočiti iz memorije u firebase?')) {
            return
        }
        setPoruka(null);
        setRadi(true)
        try {
            // 1. Operateri (ID-ovi nam ne trebaju, ali provjeravamo svaki rezultat)
            for (const e of operateri) {
                const { id, ...ostatak } = e
                const rezultat = await OperaterServiceFirebase.dodajBezHash(ostatak)
                provjeri(rezultat, `Operater ${ostatak.email}`)
            }

            // 2. Kategorije (trebaju nam novi ID-ovi za recepte)
            const mapiranjeIdKategorija = []
            for (const e of kategorije) {
                const { id, ...ostatak } = e
                const fb = provjeri(
                    await KategorijaServiceFirebase.dodaj(ostatak),
                    `Kategorija ${ostatak.naziv}`
                )
                mapiranjeIdKategorija.push({ idm: id, idf: fb.data.id })
            }

            // 3. Jedinice mjere
            const mapiranjeIdJedinicaMjere = []
            for (const e of jediniceMjere) {
                const { id, ...ostatak } = e
                const fb = provjeri(
                    await JedinicaMjereServiceFirebase.dodaj(ostatak),
                    `Jedinica mjere ${ostatak.naziv}`
                )
                mapiranjeIdJedinicaMjere.push({ idm: id, idf: fb.data.id })
            }

            // 4. Sastojci
            const mapiranjeIdSastojaka = []
            for (const e of sastojci) {
                const { id, ...ostatak } = e
                const fb = provjeri(
                    await SastojakServiceFirebase.dodaj(ostatak),
                    `Sastojak ${ostatak.naziv}`
                )
                mapiranjeIdSastojaka.push({ idm: id, idf: fb.data.id })
            }

            // 5. Recepti (povezivanje starih ID-ova kategorije, sastojaka i jedinica mjere s novima)
            for (const e of recepti) {
                const { id, slikaBase64, slikaPutanja, ...ostatak } = e;
                // slikaPutanja iz memorije je lokalna putanja, a ne putanja u Firebase Storageu.
                // Servis ju sam postavlja prilikom učitavanja slike.
                ostatak.slika = slikaBase64 || ''
                ostatak.slikaPutanja = ''

                // Novi ID kategorije
                const mKategorija = mapiranjeIdKategorija.find(m => m.idm == ostatak.kategorija)
                if (!mKategorija) {
                    console.warn(`Recept "${ostatak.naziv}": kategorija ${ostatak.kategorija} nije pronađena`)
                }
                ostatak.kategorija = mKategorija ? mKategorija.idf : null

                // Novi ID-ovi sastojaka i jedinica mjere
                ostatak.sastojci = (ostatak.sastojci || [])
                    .map(s => {
                        const mSastojak = mapiranjeIdSastojaka.find(m => m.idm == s.sastojak)
                        const mJedMjere = mapiranjeIdJedinicaMjere.find(m => m.idm == s.jedMjere)

                        if (!mSastojak || !mJedMjere) {
                            console.warn(
                                `Recept "${ostatak.naziv}": preskočen sastojak ${s.sastojak} / jedinica ${s.jedMjere}`
                            )
                        }
                        return {
                            sastojak: mSastojak ? mSastojak.idf : null,
                            kolicina: s.kolicina,
                            jedMjere: mJedMjere ? mJedMjere.idf : null
                        }
                    }).filter(s => s.sastojak !== null && s.jedMjere !== null); // Makni neispravne unose ako nisu pronađeni

                await ReceptServiceFirebase.dodaj(ostatak);
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
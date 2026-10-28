import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReceptService from "../../services/recepti/ReceptService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService";
import SastojakService from "../../services/sastojci/SastojakService";
import { sastojci } from "../../services/sastojci/SastojakPodaci";
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService";

export default function ReceptPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [recept, setRecept] = useState({})
    const [omiljen, setOmiljen] = useState(false)
    const [vegansko, setVegansko] = useState(false)
    const [kategorije, setKategorije] = useState([])
    const [sviSastojci, setSviSastojci] = useState([])
    const [stavkeRecepta, setStavkeRecepta] = useState([])
    const [osnovnePorcije, setOsnovnePorcije] = useState(2)

    const [jediniceMjere, setJediniceMjere] = useState([])

    const [trenutniSastojak, setTrenutniSastojak] = useState({})
    const [pretragaSastojka, setPretragaSastojka] = useState('')
    const [aktivniRed, setAktivniRed] = useState(null)
    const [prikaziAutocomplete, setPrikaziAutokomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)
    const [trenutnaKolicina, setTrenutnaKolicina] = useState('')
    const [trenutnaJedinicaMjere, setTrenutnaJedinicaMjere] = useState('')

    useEffect(() => {
        ucitajRecept()
        ucitajKategorije()
        ucitajSastojke()
        ucitajJediniceMjere()
    }, [])

    async function ucitajJediniceMjere() {
        try {
            const odgovor = await JedinicaMjereService.get()
            setJediniceMjere(odgovor.data)
        } catch (greska) {
            console.error('Greška pri učitavanju jedinica mjere:', greska)
        }
    }

    function pretvoriStariSastojak(tekst) {
        const rezultat = tekst.match(
            /^\s*(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|žlica|žličica)?\s+(.+)$/i
        )
        if (!rezultat) {
            return {
                naziv: tekst.trim(),
                kolicina: 1,
                jedinica: 'kom'
            }
        }
        return {
            kolicina: Number(rezultat[1].replace(',', '.')),
            jedinica: rezultat[2] || 'kom',
            naziv: rezultat[3].trim()
        }
    }

    async function ucitajKategorije() {
        try {
            const odgovor = await KategorijaService.get()
            setKategorije(odgovor.data)
        } catch (greska) {
            console.error('Greška pri učitavanju kategorija:', greska)
        }
    }

    async function ucitajSastojke() {
        try {
            const odgovor = await SastojakService.get()
            setSviSastojci(odgovor.data)
        } catch (greska) {
            console.error('Greška pri učitavanju sastojka:', greska)
        }
    }

    async function ucitajRecept() {
        try {
            const odgovor = await ReceptService.getById(params.id)
            const i = odgovor.data

            if (!i) {
                console.error('Recept nije pronađen')
                navigate(RouteNames.RECEPTI)
                return
            }

            setRecept(i)
            setOmiljen(i.omiljen ?? false)
            setVegansko(i.vegansko ?? false)

            const porcije = i.osnovnePorcije || 2
            setOsnovnePorcije(porcije)

            // Učitavamo katalog sastojaka
            const odgovorSastojci = await SastojakService.get()
            const sviDostupniSastojci = [...odgovorSastojci.data]

            const stariSastojci = Array.isArray(i.sastojci)
                ? i.sastojci : []

            const noveStavke = []

            for (const stavka of stariSastojci) {
                // Ako je sastojak već u novom formatu
                if (typeof stavka === 'object' && stavka !== null) {
                    const idSastojka =
                        stavka.sastojakId ?? stavka.sastojak?.id ?? stavka.sastojakId?.id ?? stavka.sastoja

                    noveStavke.push({
                        sastojakId: idSastojka === "" || idSastojka == null
                            ? "" : Number(idSastojka),
                        kolicina: stavka.kolicina ?? '',
                        jedinica: stavka.jediniceMjereId != null
                            ? jediniceMjere.find(jm => Number(jm.id) === Number(stavka.jediniceMjereId)
                            )?.naziv ?? 'g'
                            : stavka.jedinica || stavka.jedMjere || 'g'
                    })
                    continue
                }
                // Pretvaramo stari tekst u količinu, jedinicu i naziv
                const stari = pretvoriStariSastojak(String(stavka))
                let pronadeniSastojak = sviDostupniSastojci.find(
                    (sastojak) =>
                        sastojak.naziv.toLocaleLowerCase('hr') ===
                        stari.naziv.toLocaleLowerCase('hr')
                )
                // Ako sastojak ne postoji u katalogu, dodajemo ga
                if (!pronadeniSastojak && stari.naziv.trim()) {
                    await SastojakService.dodaj({
                        naziv: stari.naziv
                    })

                    const osvjezeniOdgovor = await SastojakService.get()
                    sviDostupniSastojci.splice(
                        0, sviDostupniSastojci.length, ...osvjezeniOdgovor.data)

                    pronadeniSastojak = sviDostupniSastojci.find(
                        (sastojak) =>
                            sastojak.naziv.toLocaleLowerCase('hr') ===
                            stari.naziv.toLocaleLowerCase('hr')
                    )
                }
                noveStavke.push({
                    sastojakId: pronadeniSastojak?.id ?? '',
                    kolicina: stari.kolicina,
                    jedinica: stari.jedinica
                })
            }
            setSviSastojci(sviDostupniSastojci)
            setStavkeRecepta(noveStavke)

        } catch (greska) {
            console.error('Greška pri učitavanju recepta', greska)
            navigate(RouteNames.RECEPTI)
        }
    }

    async function promijeni(recept) {
        await ReceptService.promijeni(params.id, recept).then(() => {
            navigate(RouteNames.RECEPTI)
        })
    }

    function dodajStavku() {
        setStavkeRecepta([...stavkeRecepta, {
            sastojakId: "",
            kolicina: "",
            jedinica: "g"
        }
        ])
    }
    function obrisiStavku(index) {
        setStavkeRecepta(stavkeRecepta.filter((_, i) => i !== index))
    }
    function promijeniStavku(index, polje, vrijednost) {
        setStavkeRecepta(stavkeRecepta.map((stavka, i) =>
            i === index
                ? { ...stavka, [polje]: vrijednost }
                : stavka))
    }

    function filtrirajSastojke() {
        if (!pretragaSastojka.trim()) {
            return []
        }
        return sviSastojci.filter(s => !stavkeRecepta.some(stavka => Number(stavka.sastojakId) === Number(s.id)) &&
            s.naziv.toLowerCase().includes(
                pretragaSastojka.toLowerCase()
            ))
    }

    function handleKeyDown(e, rowIndex) {
        const filtriraniSastojci = filtrirajSastojke()
        if (e.key === 'ArrowDown' && filtriraniSastojci.length > 0) {
            e.preventDefault()
            setOdabraniIndex(prev => prev >= filtriraniSastojci.length - 1 ? 0 : prev + 1)
        } else if (e.key === 'ArrowUp' && filtriraniSastojci.length > 0) {
            e.preventDefault()
            setOdabraniIndex(prev => prev <= 0 ? filtriraniSastojci.length - 1 : prev - 1)
        } else if (
            e.key === 'Enter' && prikaziAutocomplete &&
            odabraniIndex >= 0 && filtriraniSastojci[odabraniIndex]
        ) {
            e.preventDefault()
            promijeniStavku(rowIndex, 'sastojakId',
                Number(filtriraniSastojci[odabraniIndex].id))

            setPretragaSastojka('')
            setPrikaziAutokomplete(false)
            setOdabraniIndex(-1)
            setAktivniRed(null)
        } else if (e.key === 'Escape') {
            setPrikaziAutokomplete(false)
            setOdabraniIndex(-1)
            setAktivniRed(null)
        }
    }

    function odradiSubmit(e) {
        e.preventDefault()

        const podaci = new FormData(e.target)
        const sastojciZaSpremanje = stavkeRecepta.map((stavka) => {
            const jedinica = jediniceMjere.find(
                (jm) => jm.naziv === stavka.jedinica
            )
            return {
                sastojakId: Number(stavka.sastojakId),
                kolicina: Number(stavka.kolicina),
                jediniceMjere: jedinica?.id ?? null
            }
        })
        promijeni({
            naziv: podaci.get('naziv'),
            kategorija: podaci.get('kategorija'),
            vrijeme: parseInt(podaci.get('vrijeme'), 10),
            opis: podaci.get('opis'),
            osnovnePorcije: Number(osnovnePorcije),
            sastojci: sastojciZaSpremanje,
            omiljen: omiljen,
            vegansko: vegansko
        })
    }

    return (
        <div className="px-4 py-3">
            <h3>
                Promijeni recept
            </h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv recepta</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required
                        defaultValue={recept.naziv} />
                </Form.Group>

                <Form.Group controlId="kategorija">
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Select name="kategorija"
                        value={recept.kategorija || ""}
                        onChange={(e) => setRecept({
                            ...recept, kategorija: e.target.value
                        })
                        } required >
                        <option value="">-- Odaberi kategoriju --</option>
                        {recept.kategorija && !kategorije.some(
                            (kategorija) => kategorija.naziv === recept.kategorija
                        ) && (
                                <option value={recept.kategorija}>
                                    {recept.kategorija}</option>
                            )}
                        {kategorije.map((kategorija) => (
                            <option key={kategorija.id} value={kategorija.naziv}>
                                {kategorija.naziv}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="vrijeme">
                    <Form.Label>Vrijeme</Form.Label>
                    <Form.Control type="number"
                        name="vrijeme" step={1} required
                        defaultValue={recept.vrijeme} />
                </Form.Group>

                <h5 className="mt-4">Sastojci</h5>
                <Form.Group className="mb-3">
                    <Form.Label>Broj osnovnih porcija</Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        value={osnovnePorcije} onChange={(e) =>
                            setOsnovnePorcije(Number(e.target.value))
                        } required />
                </Form.Group>

                {stavkeRecepta.map((stavka, index) => (
                    <Row key={index} className="mb-3 align-items-end">



                        <Col md={5} className="position-relative">
                            <Form.Label>Sastojak</Form.Label>
                            <Form.Control type="text"
                                placeholder="Pretraži sastojke..."
                                autoComplete="off" value={
                                    aktivniRed === index
                                        ? pretragaSastojka : sviSastojci.find(s => Number(s.id) === Number(
                                            stavka.sastojakId))?.naziv || ''}
                                onFocus={() => {
                                    setAktivniRed(index)
                                    setPretragaSastojka('')
                                    setPrikaziAutokomplete(true)
                                    setOdabraniIndex(-1)
                                }}
                                onChange={(e) => {
                                    setPretragaSastojka(e.target.value)
                                    setPrikaziAutokomplete(true)
                                    setOdabraniIndex(-1)
                                }}
                                onKeyDown={(e) => handleKeyDown(e, index)} required />
                            {prikaziAutocomplete && aktivniRed === index && pretragaSastojka.trim() !== '' && (
                                <div className="position-absolute bg-white border rounded w-100"
                                    style={{
                                        zIndex: 1000,
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                    }}>
                                    {filtrirajSastojke().map((sastojak, i) => (
                                        <div key={sastojak.id}
                                            className={`px-3 py-2 ${i === odabraniIndex
                                                ? 'bg-success text-white' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={() => setOdabraniIndex(i)}
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                promijeniStavku(index, 'sastojakId', Number(sastojak.id))
                                                setAktivniRed(null)
                                                setPretragaSastojka('')
                                                setPrikaziAutokomplete(false)
                                                setOdabraniIndex(-1)
                                            }}>{sastojak.naziv}</div>
                                    ))}
                                    {filtrirajSastojke().length === 0 && (
                                        <div className="px-3 py-2 text-muted"> Nema pronađenih sastojaka</div>
                                    )}
                                </div>
                            )}
                        </Col>


                        <Col md={3}>
                            <Form.Label>Količina</Form.Label>
                            <Form.Control type="number"
                                min={0.01}
                                step="any"
                                value={stavka.kolicina ?? ""}
                                onChange={(e) => promijeniStavku(
                                    index,
                                    "kolicina",
                                    e.target.value
                                )}
                                required />
                        </Col>
                        <Col md={2}>
                            <Form.Label>Jedinica</Form.Label>
                            <Form.Select value={stavka.jedinica || "g"}
                                onChange={(e) => promijeniStavku(
                                    index, "jedinica", e.target.value)}
                            >
                                {jediniceMjere.map((jm) => (
                                    <option key={jm.id} value={jm.naziv}>{jm.naziv}</option>
                                ))}
                            </Form.Select>
                          
                                <Button type="button"
                                    variant="danger"
                                    onClick={() => obrisiStavku(index)}>
                                    Obriši
                                </Button>
                            </Col>
                    </Row>
                ))}
                <Button type="button"
                    variant="outline-success"
                    className="mb-4"
                    onClick={dodajStavku}>
                    + Dodaj sastojak
                </Button>

                <Form.Group controlId="opis">
                    <Form.Label>Opis recepta</Form.Label>
                    <Form.Control as="textarea"
                        name="opis" rows={4} required
                        defaultValue={recept.opis} />
                </Form.Group>

                <Form.Group controlId="omiljen" className="mt-3">
                    <Form.Check label="Dodaj u omiljene ❤️"
                        name="omiljen"
                        checked={omiljen}
                        onChange={(e) => setOmiljen(e.target.checked)}
                    />
                </Form.Group>


                <Form.Group controlId="vegansko" className="mt-3">
                    <Form.Check label="Dodaj u vegansko 🌱"
                        name="vegansko"
                        checked={vegansko}
                        onChange={(e) => setVegansko(e.target.checked)}
                    />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.RECEPTI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promijeni recept
                        </Button>
                    </Col>
                </Row>

            </Form>

        </div>
    )
}

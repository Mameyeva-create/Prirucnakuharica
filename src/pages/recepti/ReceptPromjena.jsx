import { Link, useNavigate, useParams } from "react-router-dom";
import ReceptService from "../../services/recepti/ReceptService";
import { RouteNames } from "../../constants";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService"
import SastojakService from "../../services/sastojci/SastojakService";
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService";
import SlikaCropper from "../../components/SlikaCropper";
import { receptSchema, stavkaSastojkaSchema, validiraj } from "../../validacije";

export default function ReceptPromjena() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [kategorije, setKategorije] = useState([])
    const [sviSastojci, setSviSastojci] = useState([])
    const [jediniceMjere, setJediniceMjere] = useState([])

    const [naziv, setNaziv] = useState('')
    const [kategorija, setKategorija] = useState('')
    const [vrijeme, setVrijeme] = useState('')
    const [opis, setOpis] = useState('')
    const [priprema, setPriprema] = useState('')
    const [omiljen, setOmiljen] = useState(false)
    const [vegansko, setVegansko] = useState(false)
    const [generirano, setGenerirano] = useState(false)

    const [trenutniSastojak, setTrenutniSastojak] = useState({})
    const [odabraniSastojci, setOdabraniSastojci] = useState([])
    const [pretragaSastojka, setPretragaSastojka] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)
    const [trenutnaJedinicaMjere, setTrenutnaJedinicaMjere] = useState(0)
    const [trenutnaKolicina, setTrenutnaKolicina] = useState('')
    const [slika, setSlika] = useState('')
    const [slikaPutanja, setSlikaPutanja] = useState('')

    useEffect(() => {
        dohvatiPodatke()
    }, [])

    async function dohvatiPodatke() {
        try {
            const jmOdgovor = await JedinicaMjereService.get()
            setJediniceMjere(jmOdgovor.data)

            const katOdgovor = await KategorijaService.get()
            setKategorije(katOdgovor.data)

            const sastojciOdgovor = await SastojakService.get()
            setSviSastojci(sastojciOdgovor.data)

            const receptOdgovor = await ReceptService.getById(id)
            const r = receptOdgovor.data

            // console.log('SASTOJCI RECEPTA:', r.sastojci)
            // console.log('SVI SASTOJCI:', sastojciOdgovor.data)

            setNaziv(r.naziv || '')
            setKategorija(r.kategorija || '')
            setVrijeme(r.vrijeme || '')
            setOpis(r.opis || '')
            setPriprema(r.priprema || '')
            setOmiljen(r.omiljen || false)
            setVegansko(r.vegansko || false)
            setSlika(r.slika || '')
            setSlikaPutanja(r.slikaPutanja || '')
            setOdabraniSastojci(Array.isArray(r.sastojci) ? r.sastojci : [])
            setGenerirano(r.generirano)

        } catch (greska) {
            console.error('Greška pri dohvaćanju podataka za promjenu:', greska)
            alert('Ne mogu učitati podatke recepta.')
        }
    }

    function dodajStavku() {
        const rezultat = validiraj(stavkaSastojkaSchema, {
            sastojak: trenutniSastojak.id,
            kolicina: trenutnaKolicina,
            jedMjere: trenutnaJedinicaMjere,
        })
        if (!rezultat.ok) {
            alert(rezultat.greska)
            return
        }
        // 4. sastojak ne smije već biti u receptu
        const postoji = odabraniSastojci.some(
            s => Number(s.sastojak) === rezultat.data.sastojak
        )
        if (postoji) {
            alert('Ovaj sastojak već je dodan u recept')
            return
        }

        setOdabraniSastojci([...odabraniSastojci, rezultat.data])
        setOdabraniIndex(-1)
        setPrikaziAutocomplete(false)
        setPretragaSastojka('')
        setTrenutnaJedinicaMjere(0)
        setTrenutnaKolicina('')
        setTrenutniSastojak({})
    }

    async function odradiSubmit(e) {
        e.preventDefault()

        if (odabraniSastojci.length === 0 && (trenutniSastojak.id || trenutnaKolicina)) {
            alert('Klikni "+ Dodaj sastojak" prije spremanja recepta')
            return
        }
        const rezultat = validiraj(receptSchema, {
            naziv, kategorija, vrijeme, opis, priprema,
            sastojci: odabraniSastojci,
            omiljen, vegansko,
        })
        if (!rezultat.ok) {
            alert(rezultat.greska)
            return
        }
        const recept = { ...rezultat.data, slika, slikaPutanja, generirano }
        try {
            await ReceptService.promijeni(id, recept)
            navigate(RouteNames.RECEPTI)
        } catch (greska) {
            console.error('Greška pri promjeni recepta:', greska)
            alert('Recept nije promijenjen. Provjeri konzolu')
        }
    }

    function filtrirajSastojke() {
        if (!pretragaSastojka) return []
        return sviSastojci.filter(p =>
            !odabraniSastojci.some(op => Number(op.sastojak) === Number(p.id)) &&
            (p.naziv.toLowerCase().includes(pretragaSastojka.toLowerCase()))
        )
    }

    function handleKeyDown(e) {
        const filtriraniSastojci = filtrirajSastojke()

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOdabraniIndex(prev => {
                if (prev + 1 === filtriraniSastojci.length) {
                    return 0
                }
                return prev < filtriraniSastojci.length - 1 ? prev + 1 : prev
            })
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setOdabraniIndex(prev => {
                if (prev === 0) {
                    return filtriraniSastojci.length - 1
                }
                return prev > 0 ? prev - 1 : 0
            })
        } else if (e.key === 'Enter' && odabraniIndex >= 0 && filtriraniSastojci.length > 0) {
            e.preventDefault()
            setTrenutniSastojak(filtriraniSastojci[odabraniIndex])
            setPrikaziAutocomplete(false)
            setPretragaSastojka('')
        } else if (e.key === 'Escape') {
            setPrikaziAutocomplete(false)
            setOdabraniIndex(-1)
        }
    }

    function ukloniSastojak(idSastojka) {
        setOdabraniSastojci(odabraniSastojci.filter(st => Number(st.sastojak) !== Number(idSastojka)))
    }
    function promijeniKolicinu(idSastojka, novaKolicina) {
        setOdabraniSastojci(
            odabraniSastojci.map(st => Number(st.sastojak) === Number(idSastojka)
                ? { ...st, kolicina: Number(novaKolicina) }
                : st
            )
        )
    }

    function promijeniJedinicu(idSastojka, novaJedinica) {
        setOdabraniSastojci(
            odabraniSastojci.map(st =>
                Number(st.sastojak) === Number(idSastojka)
                    ? { ...st, jedMjere: Number(novaJedinica) }
                    : st
            )
        )
    }
    function nazivJM(sifraJM) {
        //   console.log(jediniceMjere)
        // console.log(sifraJM)
        const jm = jediniceMjere.find(
            jm => Number(jm.id) === Number(sifraJM))
        return jm?.naziv || 'Nepoznato'
    }

    return (
        <>
            <Form onSubmit={odradiSubmit}>
                <Container>
                    <Card className='shadow-sm'>
                        <Card.Header><h3>Promjena recepta 🍃</h3></Card.Header>
                        <Card.Body className="pt-5">
                            <Row className="g-4 mx-0">
                                {/* LIJEVA KOLONA */}
                                <Col xs={12} md={6} className="d-flex flex-column">
                                    <Form.Group controlId="naziv" className="mb-3">
                                        <Form.Label>Naziv recepta</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            value={naziv}
                                            onChange={(e) => setNaziv(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="kategorija" className="mb-3">
                                        <Form.Label>Kategorija</Form.Label>
                                        <Form.Select
                                            name="kategorija"
                                            value={kategorija}
                                            onChange={(e) => setKategorija(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Odaberi kategoriju --</option>
                                            {kategorije.map((kat) => (
                                                <option key={kat.id} value={kat.id}>{kat.naziv}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="vrijeme" className="mb-3">
                                        <Form.Label>Vrijeme (minute)</Form.Label>
                                        <Form.Control type="number"
                                            name="vrijeme" step={1} min={1} max={300}
                                            value={vrijeme}
                                            onChange={(e) => setVrijeme(e.target.value)}
                                            required />
                                    </Form.Group>

                                    <Form.Group controlId="opis" className="mb-3">
                                        <Form.Label>Opis recepta</Form.Label>
                                        <Form.Control as="textarea"
                                            name="opis" rows={5}
                                            value={opis}
                                            onChange={(e) => setOpis(e.target.value)}
                                            placeholder="Opiši pripremu i posebnosti recepta..." required />
                                    </Form.Group>
                                    <Form.Group controlId="priprema" className="mb-3">
                                        <Form.Label>Priprema</Form.Label>
                                        <Form.Control as="textarea" name="priprema" rows={6}
                                            value={priprema}
                                            onChange={(e) => setPriprema(e.target.value)} />
                                    </Form.Group>

                                    <SlikaCropper
                                        slika={slika || slikaPutanja}
                                        onPromjena={(novaSlika) => {
                                            setSlika(novaSlika)
                                            setSlikaPutanja('')   // nova slika (ili uklanjanje) zamjenjuje staru putanju
                                        }}
                                    />
                                    <Row className="g-2 mt-auto pt-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="omiljen" className="mb-3">
                                                <Form.Check label="Dodaj u omiljene ❤️"
                                                    type="checkbox"
                                                    name="omiljen"
                                                    checked={omiljen}
                                                    onChange={(e) => setOmiljen(e.target.checked)} />
                                            </Form.Group>

                                            <Form.Group controlId="vegansko" className="mb-3">
                                                <Form.Check label="Dodaj u vegansko 🌱"
                                                    type="checkbox"
                                                    name="vegansko"
                                                    checked={vegansko}
                                                    onChange={(e) => setVegansko(e.target.checked)} />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                </Col>
                                {/* DESNA KOLONA */}
                                <Col xs={12} md={6} className="d-flex flex-column">

                                    <Form.Group className="mb-3 position-relative">
                                        <Form.Label className="fw-bold">Dodaj sastojak <span
                                            style={{ color: 'red' }}>
                                            {trenutniSastojak.naziv}
                                        </span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Pretraži sastojke..."
                                            value={pretragaSastojka}
                                            onChange={(e) => {
                                                setPretragaSastojka(e.target.value)
                                                setPrikaziAutocomplete(e.target.value.length > 0)
                                                setOdabraniIndex(-1)
                                            }}
                                            onFocus={() => setPrikaziAutocomplete(pretragaSastojka.length > 0)}
                                            onKeyDown={handleKeyDown}
                                        />
                                        {prikaziAutocomplete && filtrirajSastojke().length > 0 && (
                                            <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                                {filtrirajSastojke().map((s, index) => (
                                                    <div
                                                        key={s.id}
                                                        className="p-2 cursor-pointer"
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: index === odabraniIndex ? '#007bff' : 'white',
                                                            color: index === odabraniIndex ? 'white' : 'black'
                                                        }}
                                                        onClick={() => {
                                                            setTrenutniSastojak(s)
                                                            setPrikaziAutocomplete(false)
                                                            setOdabraniIndex(0)
                                                            setPretragaSastojka('')
                                                        }}
                                                        onMouseEnter={() => {
                                                            setOdabraniIndex(index)
                                                        }}
                                                    >
                                                        {s.naziv}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Form.Group>

                                    <Row className="g-2 align-items-end">
                                        <Col xs={4}>
                                            <Form.Label>Količina</Form.Label>
                                            <Form.Control
                                                type="number" min="0.01"
                                                step="any"
                                                name="kolicina"
                                                value={trenutnaKolicina}
                                                onChange={(e) => { setTrenutnaKolicina(e.target.value) }}
                                                placeholder="Količina" />
                                        </Col>
                                        <Col xs={4}>
                                            <Form.Label>Jedinica</Form.Label>
                                            <Form.Select name="jm"
                                                value={trenutnaJedinicaMjere}
                                                onChange={(e) => { setTrenutnaJedinicaMjere(parseInt(e.target.value)) }}>
                                                <option value="">Odaberite jedinicu mjere</option>
                                                {jediniceMjere && jediniceMjere.map((jm) => (
                                                    <option key={jm.id} value={jm.id}>
                                                        {jm.naziv}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4}>
                                            <Button type="button"
                                                variant="outline-success"
                                                onClick={dodajStavku}
                                                className="w-100">
                                                + Dodaj sastojak
                                            </Button>
                                        </Col>
                                    </Row>

                                    {odabraniSastojci.length > 0 && (
                                        <>
                                            <hr />
                                            <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
                                                <Table striped bordered hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Naziv</th>
                                                            <th>Količina</th>
                                                            <th>Jedinica mjere</th>
                                                            <th style={{ width: '80px' }}>Akcija</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {odabraniSastojci.map(ts => {
                                                            const sastojak = sviSastojci.find(s => Number(s.id) ===
                                                                Number(ts.sastojak))
                                                            return (
                                                                <tr key={ts.sastojak}>
                                                                    <td>{sastojak?.naziv || 'Nepoznato'}</td>
                                                                    <td>
                                                                        <Form.Control type="number" min={0.01}
                                                                            step="any" value={ts.kolicina}
                                                                            onChange={(e) => promijeniKolicinu(ts.sastojak, e.target.value)} size="sm"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Select size="sm" value={ts.jedMjere}
                                                                            onChange={(e) => promijeniJedinicu(ts.sastojak, e.target.value)}>
                                                                            {jediniceMjere.map(jm => (
                                                                                <option key={jm.id} value={jm.id}>{jm.naziv}</option>
                                                                            ))}
                                                                        </Form.Select>
                                                                    </td>
                                                                    <td>
                                                                        <Button type="button"
                                                                            variant="danger"
                                                                            size="sm"
                                                                            onClick={() => ukloniSastojak(ts.sastojak)}
                                                                        >
                                                                            Obriši
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </>
                                    )}
                                    {odabraniSastojci.length === 0 && (
                                        <p className="text-muted">Nema odabranih sastojaka</p>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mt-3 align-items-center">
                                <Col xs={6}>
                                    <Link to={RouteNames.RECEPTI} className="btn btn-danger">
                                        Odustani
                                    </Link>
                                </Col>
                                <Col xs={6} className="text-end">
                                    <Button type="submit" variant="success">
                                        Promijeni recept
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}
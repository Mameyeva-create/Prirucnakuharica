import { Link, useNavigate, useParams } from "react-router-dom";
import ReceptService from "../../services/recepti/ReceptService";
import { RouteNames } from "../../constants";
import { Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService"
import SastojakService from "../../services/sastojci/SastojakService";
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService";

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
    const [omiljen, setOmiljen] = useState(false)
    const [vegansko, setVegansko] = useState(false)

    const [trenutniSastojak, setTrenutniSastojak] = useState({})
    const [odabraniSastojci, setOdabraniSastojci] = useState([])
    const [pretragaSastojka, setPretragaSastojka] = useState('')
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false)
    const [odabraniIndex, setOdabraniIndex] = useState(-1)
    const [trenutnaJedinicaMjere, setTrenutnaJedinicaMjere] = useState(0)
    const [trenutnaKolicina, setTrenutnaKolicina] = useState('')

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

            const receptOdgovor = await ReceptService.getByIid ? await ReceptService.getByIid(id) : await ReceptService.getById(id)
            const r = receptOdgovor.data

            setNaziv(r.naziv || '')
            setKategorija(r.kategorija || '')
            setVrijeme(r.vrijeme || '')
            setOpis(r.opis || '')
            setOmiljen(r.omiljen || false)
            setVegansko(r.vegansko || false)

            if (r.sastojci && Array.isArray(r.sastojci)) {
                const mapiraniSastojci = r.sastojci.map(s => {
                    const pronadjeniSastojak = sastojciOdgovor.data.find(st => st.id === (s.sastojak?.id || s.sastojak))
                    const pronadjenaJM = jmOdgovor.data.find(jm => jm.id === (s.jedinicaMjere?.id || s.jedinicaMjere))
                    return {
                        sastojak: pronadjeniSastojak || { id: s.sastojak, naziv: s.sastojakNaziv || 'Nepoznato' },
                        jedinicaMjere: pronadjenaJM || { id: s.jedinicaMjere, naziv: s.jedinicaMjereNaziv || '' },
                        kolicina: s.kolicina
                    }
                })
                setOdabraniSastojci(mapiraniSastojci)
            }
        } catch (greska) {
            console.error('Greška pri dohvaćanju podataka za promjenu:', greska)
            alert('Ne mogu učitati podatke recepta.')
        }
    }

    function dodajStavku() {
        if (!trenutniSastojak.id || !trenutnaKolicina || !trenutnaJedinicaMjere) {
            alert('Molimo odaberite sastojak, unesite količinu i izaberite jedinicu mjere.')
            return
        }

        const nova = {
            sastojak: trenutniSastojak,
            jedinicaMjere: jediniceMjere.find(jm => jm.id === parseInt(trenutnaJedinicaMjere)),
            kolicina: trenutnaKolicina,
        }

        setOdabraniSastojci([...odabraniSastojci, nova])
        setOdabraniIndex(-1)
        setPrikaziAutocomplete(false)
        setTrenutnaJedinicaMjere(0)
        setTrenutnaKolicina('')
        setTrenutniSastojak({})
    }

    async function odradiSubmit(e) {
        e.preventDefault()

        if (naziv.trim().length < 2) {
            alert('Naziv recepta mora imati najmanje 2 znaka')
            return
        }

        if (!kategorija || kategorija.trim().length < 2) {
            alert('Unesi kategoriju s najmanje 2 znaka')
            return
        }

        const parsedVrijeme = parseInt(vrijeme, 10)
        if (isNaN(parsedVrijeme) || parsedVrijeme < 1 || parsedVrijeme > 300) {
            alert('Vrijeme mora biti između 1 i 300 minuta')
            return
        }

        if (opis.trim().length < 5) {
            alert('Opis recepta mora imati najmanje 5 znakova')
            return
        }

        const recept = {
            naziv: naziv.trim(),
            kategorija,
            vrijeme: parsedVrijeme,
            opis: opis.trim(),
            sastojci: odabraniSastojci.map(s => ({
                sastojak: s.sastojak.id,
                jedinicaMjere: s.jedinicaMjere.id,
                kolicina: s.kolicina
            })),
            omiljen,
            vegansko
        }

        try {
            await ReceptService.promjena(id, recept)
            navigate(RouteNames.RECEPTI)
        } catch (greska) {
            console.error('Greška pri promjeni recepta:', greska)
            alert('Recept nije promijenjen. Provjeri konzolu')
        }
    }

    function filtrirajSastojke() {
        if (!pretragaSastojka) return []
        return sviSastojci.filter(p =>
            !odabraniSastojci.find(op => op.sastojak.id === p.id) &&
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
        setOdabraniSastojci(odabraniSastojci.filter(st => st.sastojak.id !== idSastojka))
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
                                                <option key={kat.id} value={kat.naziv}>{kat.naziv}</option>
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
                                            <div style={{ overflow: 'auto', maxHeight: '250px' }}>
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
                                                        {odabraniSastojci.map(ts => (
                                                            <tr key={ts.sastojak.id}>
                                                                <td>{ts.sastojak.naziv}</td>
                                                                <td>{ts.kolicina}</td>
                                                                <td>{ts.jedinicaMjere?.naziv} </td>
                                                                <td>
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => ukloniSastojak(ts.sastojak.id)}
                                                                    >
                                                                        Obriši
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
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
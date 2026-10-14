
import { Link, useNavigate } from "react-router-dom";
import ReceptService from "../../services/recepti/ReceptService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService"

export default function ReceptNovi() {
    const navigate = useNavigate()

    const [kategorije, setKategorije] = useState([])

    useEffect(() => {
        ucitajKategorije()
    }, [])

    async function ucitajKategorije() {
        try {
            const odgovor = await KategorijaService.get()
            setKategorije(odgovor.data)
        } catch (greska) {
            console.error('Greška pri učitavanju kategorija:', greska)
        }
    }

    async function odradiSubmit(e) {
        e.preventDefault()
        // console.log('Klik na Dodaj novi recept');

        const podaci = new FormData(e.target)

        const naziv = podaci.get('naziv').trim()
        const kategorija = podaci.get('kategorija')
        const vrijeme = parseInt(podaci.get('vrijeme'), 10)
        const opis = podaci.get('opis').trim()
        const sastojci = podaci.get('sastojci').trim()

        if (naziv.length < 2) {
            alert('Naziv recepta mora imati najmanje 2 znaka')
            return
        }

        if (!kategorija || kategorija.trim().length < 2) {
            alert('Unesi kategoriju s najmanje 2 znaka')
            return
            // if (!['Doručak', 'Ručak', 'Večera', 'Desert'].includes(kategorija)) {
            //     alert('Odaberi ispravnu kategoriju')
            //     return
        }

        if (isNaN(vrijeme) || vrijeme < 1 || vrijeme > 300) {
            alert('Vrijeme nora biti između 1 i 300 minuta')
            return
        }

        if (opis.length < 5) {
            alert('Opis recepata mora imati najmanje 5 znakova')
            return
        }

        if (sastojci.length < 2) {
            alert('Unesi sastojke recepta')
            return
        }
        const recept = {
            naziv,
            kategorija,
            vrijeme,
            opis,
            sastojci,
            omiljen: podaci.get('omiljen') === 'on',
            vegansko: podaci.get('vegansko') === 'on'
        }
        try {
            await ReceptService.dodaj(recept)
            navigate(RouteNames.RECEPTI)
        } catch (greska) {
            console.error('Greška pri dodavanju recepta:', greska)
            alert('Recept nije dodan. Provjeri konzolu')
        }
    }

    return (
        <>
            <h3>
                Unos novog recepata
            </h3>
            <Form onSubmit={odradiSubmit}>

                <Row className="g-4">
                    <Col md={6} className="d-flex flex-column">

                        <Form.Group controlId="naziv" className="mb-3">
                            <Form.Label>Naziv recepta</Form.Label>
                            <Form.Control type="text"
                                name="naziv" required />
                        </Form.Group>

                        <Form.Group controlId="kategorija" className="mb-3">
                            <Form.Label>Kategorija</Form.Label>
                            <Form.Select name="kategorija" required>
                                <option value="">-- Odaberi kategoriju --</option>
                                {kategorije.map((kategorija) => (
                                    <option key={kategorija.id} value={kategorija.naziv}>{kategorija.naziv}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="vrijeme" className="mb-3">
                            <Form.Label>Vrijeme (minute)</Form.Label>
                            <Form.Control type="number"
                                name="vrijeme" step={1} min={1} max={300}
                                required />
                        </Form.Group>


                        <div className="h-100 d-flex flex-column">
                            <div className="mt-auto pt-3">
                                <Link to={RouteNames.RECEPTI} className="btn btn-danger">
                                    Odustani
                                </Link>
                            </div>
                        </div>
                    </Col>



                    <Col md={6}>
                        <Form.Group controlId="opis" className="mb-3">
                            <Form.Label>Opis recepta</Form.Label>
                            <Form.Control as="textarea"
                                name="opis" rows={4} required />
                        </Form.Group>

                        <Form.Group controlId="sastojci" className="mb-3">
                            <Form.Label>Sastojci</Form.Label>
                            <Form.Control as="textarea"
                                name="sastojci" rows={4}
                                placeholder="Npr. piletina, krumpir, mrkva"
                                required />
                            <Form.Text muted>
                                Odvoji sastojke zarezima
                            </Form.Text>
                        </Form.Group>


                        <Form.Group controlId="omiljen" className="mb-3">
                            <Form.Check label="Dodaj u omiljene ❤️"
                                type="checkbox"
                                name="omiljen"
                            />
                        </Form.Group>

                        <Form.Group controlId="vegansko" className="mb-3">
                            <Form.Check label="Dodaj u vegansko 🌱"
                                type="checkbox"
                                name="vegansko"
                            />
                        </Form.Group>


                        <Button type="submit" variant="success" className="mt-3">
                            Dodaj novi recept
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

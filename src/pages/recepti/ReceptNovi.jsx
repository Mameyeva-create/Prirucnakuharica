
import { Link, useNavigate } from "react-router-dom";
import ReceptService from "../../services/recepti/ReceptService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";


export default function ReceptNovi() {

    const navigate = useNavigate()

    async function dodaj(recept) {
        await ReceptService.dodaj(recept).then(() => {
            navigate(RouteNames.RECEPTI)
        })
    }
    function odradiSubmit(e) {
        e.preventDefault()

        const podaci = new FormData(e.target)

        const naziv = podaci.get('naziv').trim()
        const kategorija = podaci.get('kategorija')
        const vrijeme = parseInt(podaci.get('vrijeme'))
        const opis = podaci.get('opis').trim()

        if (naziv.length < 2) {
            alert('Naziv recepta mora imati najmanje 2 znaka')
            return
        }

        if (!['Doručak', 'Ručak', 'Večera', 'Desert'].includes(kategorija)) {
            alert('Odaberi ispravnu kategoriu')
            return
        }

        if (isNaN(vrijeme) || vrijeme < 1 || vrijeme > 300) {
            alert('Vrijeme nora biti između 1 i 300 minuta')
            return
        }

        if (opis.length < 5) {
            alert('Opis recepata mora imati najmanje 5 znakova')
            return
        }
        dodaj({
            naziv: podaci.get('naziv'),
            kategorija: podaci.get('kategorija'),
            vrijeme: parseInt(podaci.get('vrijeme')),
            opis: podaci.get('opis'),
            omiljen: podaci.get('omiljen') === 'on',
            vegansko: podaci.get('vegansko') === 'on'
        })
    }

    return (
        <>
            <h3>
                Unos novog recepata
            </h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv recepta</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required />
                </Form.Group>

                <Form.Group controlId="kategorija">
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Select name="kategorija" required>
                        <option value="">-- Odaberi kategoriju --</option>
                        <option value="Doručak">Doručak</option>
                        <option value="Doručak">Ručak</option>
                        <option value="Doručak">Večera</option>
                        <option value="Doručak">Desert</option>
                    </Form.Select>
                    {/* <Form.Control type="text"
                        name="kategorija" required /> */}
                </Form.Group>

                <Form.Group controlId="vrijeme">
                    <Form.Label>Vrijeme (minute)</Form.Label>
                    <Form.Control type="number"
                        name="vrijeme" step={1} min={1} max={300}
                        required />
                </Form.Group>

                <Form.Group controlId="opis">
                    <Form.Label>Opis recepta</Form.Label>
                    <Form.Control as="textarea"
                        name="opis" rows={4} required />
                </Form.Group>

                <Form.Group controlId="omiljen" className="mt-3">
                    <Form.Check label="Dodaj u omiljene ❤️"
                        type="checkbox"
                        name="omiljen"
                    />
                </Form.Group>

                <Form.Group controlId="vegansko" className="mt-3">
                    <Form.Check label="Dodaj u vegansko 🌱"
                        type="checkbox"
                        name="vegansko"
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
                            Dodaj novi recept
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

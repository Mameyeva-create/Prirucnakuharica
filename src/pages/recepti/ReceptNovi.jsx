import { use } from "react";
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

        dodaj({
            naziv: podaci.get('naziv'),
            kategorija: podaci.get('kategorija'),
            vrijeme: parseInt(podaci.get('vrijeme')),
            opis: podaci.get('opis'),
            omiljen: podaci.get('omiljen') ==='on'
        })
    }

    return (
        <>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv recepta</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required />
                </Form.Group>

                <Form.Group controlId="kategorija">
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Control type="text"
                        name="kategorija" required />
                </Form.Group>

                <Form.Group controlId="vrijeme">
                    <Form.Label>Vrijeme</Form.Label>
                    <Form.Control type="number"
                        name="vrijeme" step={1} required />
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

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.RECEPTI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj svoj recept
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

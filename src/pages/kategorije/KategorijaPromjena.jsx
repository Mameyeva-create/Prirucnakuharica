import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { RouteNames } from "../../constants"
import { kategorijaSchema, validiraj } from "../../validacije"

export default function KategorijaPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [kategorija, setKategorija] = useState({})
    const [greska, setGreska] = useState("")

    useEffect(() => {
        ucitajKategorija()
    }, [])

    async function ucitajKategorija() {
        try {
            const odgovor = await KategorijaService.getById(params.id)
            if (odgovor?.success === false) {
                alert(odgovor.message || 'Kategorija nije pronađena')
                navigate(RouteNames.KATEGORIJE)
                return
            }
            setKategorija(odgovor.data || {})
        } catch (greska) {
            console.error('Greška pri učitavanju kategorije:', greska)
            alert('Greška pri učitavanju kategorije')
            navigate(RouteNames.KATEGORIJE)
        }
    }

    async function promijeni(podaci) {
        try {
            const odgovor = await KategorijaService.promijeni(params.id, podaci)
            if (odgovor?.success === false) {
                setGreska(odgovor.message || 'Kategorija nije promijenjena')
                return
            }
            navigate(RouteNames.KATEGORIJE)
        } catch (greska) {
            console.error('Greška pri promjeni kategorije:', greska)
            setGreska('Kategorija nije promijenjena')
        }
    }

    function odradiSubmit(e) {
        e.preventDefault()
        setGreska("")

        const podaci = new FormData(e.target)
        const rezultat = validiraj(kategorijaSchema, { naziv: podaci.get('naziv') ?? '' })
        if (!rezultat.ok) {
            setGreska(rezultat.greska)
            return
        }
        promijeni({ ...rezultat.data, generirano: kategorija.generirano })
    }

    return (
        <Form onSubmit={odradiSubmit}>
            <Container>
                <Card className="shadow-sm">
                    <Card.Header><h3>Promjena kategorije 🍃</h3></Card.Header>
                    <Card.Body className="pt-4">
                        {greska && <Alert variant="danger">{greska}</Alert>}

                        <Form.Group controlId="naziv" className="mb-3">
                            <Form.Label>Naziv kategorije</Form.Label>
                            <Form.Control
                                type="text"
                                name="naziv"
                                required
                                key={kategorija?.id}
                                defaultValue={kategorija?.naziv || ""}
                            />
                        </Form.Group>

                        <Row className="mt-4 align-items-center">
                            <Col xs={6}>
                                <Link to={RouteNames.KATEGORIJE} className="btn btn-danger">
                                    Odustani
                                </Link>
                            </Col>
                            <Col xs={6} className="text-end">
                                <Button type="submit" variant="success">
                                    Promijeni kategoriju
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </Form>
    )
}
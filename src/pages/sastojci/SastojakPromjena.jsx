import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import SastojakService from "../../services/sastojci/SastojakService"
import { RouteNames } from "../../constants"
import { sastojakSchema, validiraj } from "../../validacije"

export default function SastojakPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [sastojak, setSastojak] = useState({})
    const [greska, setGreska] = useState("")

    useEffect(() => {
        ucitajSastojak()
    }, [])

    async function ucitajSastojak() {
        const odgovor = await SastojakService.getById(params.id)
        setSastojak(odgovor.data || {})
    }

    async function promijeni(podaci) {
        const odgovor = await SastojakService.get()
        const sastojci = odgovor.data || []
        const ocisceniNaziv = podaci.naziv.trim()

        const postoji = sastojci.some(s =>
            String(s.id) !== String(params.id) &&
            s.naziv.trim().toLocaleLowerCase('hr') === ocisceniNaziv.toLocaleLowerCase('hr')
        )
        if (postoji) {
            setGreska('Sastojak s tim nazivom već postoji!')
            return
        }

        await SastojakService.promijeni(params.id, podaci)
        navigate(RouteNames.SASTOJCI)
    }

    function odradiSubmit(e) {
        e.preventDefault()
        setGreska('')

        const podaci = new FormData(e.target)
        const rezultat = validiraj(sastojakSchema, { naziv: podaci.get('naziv') ?? '' })
        if (!rezultat.ok) {
            setGreska(rezultat.greska)
            return
        }
        promijeni({ ...rezultat.data, generirano: sastojak?.generirano })
    }

    return (
        <Form onSubmit={odradiSubmit}>
            <Container>
                <Card className="shadow-sm">
                    <Card.Header><h3>Promjena sastojka 🍃</h3></Card.Header>
                    <Card.Body className="pt-4">
                        {greska && <Alert variant="danger">{greska}</Alert>}

                        <Form.Group controlId="naziv" className="mb-3">
                            <Form.Label>Naziv sastojka</Form.Label>
                            <Form.Control
                                type="text"
                                name="naziv"
                                required
                                key={sastojak?.id}
                                defaultValue={sastojak?.naziv || ""}
                            />
                        </Form.Group>

                        <Row className="mt-4 align-items-center">
                            <Col xs={6}>
                                <Link to={RouteNames.SASTOJCI} className="btn btn-danger">
                                    Odustani
                                </Link>
                            </Col>
                            <Col xs={6} className="text-end">
                                <Button type="submit" variant="success">
                                    Promijeni sastojak
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </Form>
    )
}
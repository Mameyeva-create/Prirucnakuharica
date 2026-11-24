import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService"
import { RouteNames } from "../../constants"
import { jedinicaMjereSchema, validiraj } from "../../validacije"

export default function JedinicaMjerePromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [jedinicaMjere, setJedinicaMjere] = useState({})
    const [greska, setGreska] = useState("")

    useEffect(() => {
        ucitajJedinicaMjere()
    }, [])

    async function ucitajJedinicaMjere() {
        const odgovor = await JedinicaMjereService.getById(params.id)
        setJedinicaMjere(odgovor.data || {})
    }

    async function promijeni(podaci) {
        const odgovor = await JedinicaMjereService.get()
        const jediniceMjere = odgovor.data || []
        const ocisceniNaziv = podaci.naziv.trim()

        const postoji = jediniceMjere.some(j =>
            String(j.id) !== String(params.id) &&
            j.naziv.trim().toLocaleLowerCase('hr') === ocisceniNaziv.toLocaleLowerCase('hr')
        )
        if (postoji) {
            setGreska('Jedinica mjere s tim nazivom već postoji!')
            return
        }

        await JedinicaMjereService.promijeni(params.id, {
            naziv: ocisceniNaziv,
            generirano: podaci.generirano
        })
        navigate(RouteNames.JEDINICE_MJERE)
    }

    function odradiSubmit(e) {
        e.preventDefault()
        setGreska("")

        const podaci = new FormData(e.target)
        const rezultat = validiraj(jedinicaMjereSchema, { naziv: podaci.get('naziv') ?? '' })
        if (!rezultat.ok) {
            setGreska(rezultat.greska)
            return
        }
        promijeni({ ...rezultat.data, generirano: jedinicaMjere?.generirano })
    }

    return (
        <Form onSubmit={odradiSubmit}>
            <Container>
                <Card className="shadow-sm">
                    <Card.Header><h3>Promjena jedinice mjere 🍃</h3></Card.Header>
                    <Card.Body className="pt-4">
                        {greska && <Alert variant="danger">{greska}</Alert>}

                        <Form.Group controlId="naziv" className="mb-3">
                            <Form.Label>Naziv jedinice mjere</Form.Label>
                            <Form.Control
                                type="text"
                                name="naziv"
                                required
                                key={jedinicaMjere?.id}
                                defaultValue={jedinicaMjere?.naziv || ""}
                            />
                        </Form.Group>

                        <Row className="mt-4 align-items-center">
                            <Col xs={6}>
                                <Link to={RouteNames.JEDINICE_MJERE} className="btn btn-danger">
                                    Odustani
                                </Link>
                            </Col>
                            <Col xs={6} className="text-end">
                                <Button type="submit" variant="success">
                                    Promijeni jedinicu mjere
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </Form>
    )
}
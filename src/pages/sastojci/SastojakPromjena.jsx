import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SastojakService from "../../services/sastojci/SastojakService";
import { RouteNames } from "../../constants";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";
import { sastojakSchema, validiraj } from "../../validacije";


export default function SastojakPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [sastojak, setSastojak] = useState({})
    const [greska, setGreska] = useState("")

    useEffect(() => {
        ucitajSastojak()
    }, [])

    async function ucitajSastojak() {
        // debugger
        await SastojakService.getById(params.id).then((odgovor) => {
            setSastojak(odgovor.data || {})
        })
    }

    async function promijeni(sastojak) {
        const odgovor = await SastojakService.get()
        const sastojci = odgovor.data
        const ocisceniNaziv = sastojak.naziv.trim()
        const postoji = sastojci.some(s =>
            String(s.id) !== String(params.id) &&
            s.naziv.trim().toLocaleLowerCase('hr') ===
            ocisceniNaziv.toLocaleLowerCase('hr')
        )
        if (postoji) {
            setGreska('Sastojak s tim nazivom već postoji!')
            return
        }

        await SastojakService.promijeni(params.id, sastojak).then(() => {
            navigate(RouteNames.SASTOJCI)
        })
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
        <>
            <h3>
                Promijeni sastojak
            </h3>
            <Form onSubmit={odradiSubmit}>
                {greska && (
                    <Alert variant="danger">{greska}</Alert>
                )}

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv sastojak</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required
                        key={sastojak?.id}
                        defaultValue={sastojak?.naziv || ""} />
                </Form.Group>



                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.SASTOJCI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promijeni sastojak
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

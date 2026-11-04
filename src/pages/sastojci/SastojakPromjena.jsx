import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SastojakService from "../../services/sastojci/SastojakService";
import { RouteNames } from "../../constants";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";


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
            const i = odgovor.data
            setSastojak(i)

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
        const naziv = podaci.get('naziv').trim()

        if (!naziv) {
            setGreska('Unesite naziv sastojka')
            return
        }

        promijeni({
            naziv: podaci.get('naziv')
        })
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

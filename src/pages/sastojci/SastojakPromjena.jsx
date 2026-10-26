import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SastojakService from "../../services/sastojci/SastojakService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";


export default function SastojakPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [sastojak, setSastojak] = useState({})

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
        await SastojakService.promijeni(params.id, sastojak).then(() => {
            navigate(RouteNames.SASTOJCI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()

        const podaci = new FormData(e.target)

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

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv sastojak</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required 
                        defaultValue={sastojak?.naziv || ""}/>
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

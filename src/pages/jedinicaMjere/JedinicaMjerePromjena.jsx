import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";


export default function JedinicaMjerePromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [jedinicaMjere, setJedinicaMjere] = useState({})

    useEffect(() => {
        ucitajJedinicaMjere()
    }, [])

    async function ucitajJedinicaMjere() {
       // debugger
        await JedinicaMjereService.getById(params.id).then((odgovor) => {
            const i = odgovor.data
            setJedinicaMjere(i)

        })
    }

    async function promijeni(jedinicaMjere) {
        await JedinicaMjereService.promijeni(params.id, jedinicaMjere).then(() => {
            navigate(RouteNames.JEDINICE_MJERE)
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
                Promijeni JM
            </h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv JM</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required 
                        defaultValue={jedinicaMjere?.naziv || ""}/>
                </Form.Group>

               

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.JEDINICE_MJERE} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promijeni jedinicaMjere
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

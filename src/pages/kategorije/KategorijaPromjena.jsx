import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";


export default function KategorijaPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [kategorija, setKategorija] = useState({})

    useEffect(() => {
        ucitajKategorija()
    }, [])

    async function ucitajKategorija() {
       // debugger
        await KategorijaService.getById(params.id).then((odgovor) => {
            const i = odgovor.data
            setKategorija(i)

        })
    }

    async function promijeni(kategorija) {
        await KategorijaService.promijeni(params.id, kategorija).then(() => {
            navigate(RouteNames.KATEGORIJE)
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
                Promijeni kategorija
            </h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv kategorija</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required 
                        defaultValue={kategorija.naziv}/>
                </Form.Group>

               

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.KATEGORIJE} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promijeni kategorija
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

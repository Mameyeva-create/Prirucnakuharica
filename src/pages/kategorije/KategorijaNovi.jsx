
import { Link, useNavigate } from "react-router-dom";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";


export default function KategorijaNovi() {
    const navigate = useNavigate()

    async function odradiSubmit(e) {
        e.preventDefault()
        // console.log('Klik na Dodaj novi kategorija');

        const podaci = new FormData(e.target)

        const naziv = podaci.get('naziv').trim()

        if (naziv.length < 2) {
            alert('Naziv kategorije mora imati najmanje 2 znaka')
            return
        }

       
        const kategorija = {
            naziv
        }
        try {
             await KategorijaService.dodaj(kategorija)
            navigate(RouteNames.KATEGORIJE)
        } catch (greska) {
            console.error('Greška pri dodavanju kategorije:', greska)
            alert('Kategorija nije dodana. Provjeri konzolu')
        }
    }

    return (
        <>
            <h3>
                Unos nove kategorije
            </h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv kategorije</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required />
                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.KATEGORIJE} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj novu kategoriju
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { kategorijaSchema, validiraj } from "../../validacije";


export default function KategorijaPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [kategorija, setKategorija] = useState({})

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

    async function promijeni(kategorija) {
        try {
            const odgovor = await KategorijaService.promijeni(params.id, kategorija)
            if (odgovor?.success === false) {
                alert(odgovor.message || 'Kategorija nije promijenjena')
                return
            }
            navigate(RouteNames.KATEGORIJE)
        } catch (greska) {
            console.error('Greška pri promjeni kategorije:', greska)
            alert('Kategorija nije promijenjena')
        }
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        const rezultat = validiraj(kategorijaSchema, { naziv: podaci.get('naziv') ?? '' })
        if (!rezultat.ok) {
            alert(rezultat.greska)
            return
        }
        promijeni({ ...rezultat.data, generirano: kategorija.generirano })
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
                        key={kategorija?.id}
                        defaultValue={kategorija?.naziv || ""} />
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

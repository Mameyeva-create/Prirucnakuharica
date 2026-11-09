import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService";
import { RouteNames } from "../../constants";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";


export default function JedinicaMjerePromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [jedinicaMjere, setJedinicaMjere] = useState({})
    const [greska, setGreska] = useState("")

    useEffect(() => {
        ucitajJedinicaMjere()
    }, [])

    async function ucitajJedinicaMjere() {
        // debugger
        await JedinicaMjereService.getById(params.id).then((odgovor) => {
            const i = odgovor.data
            console.log("Što si vratio: ", i)
            setJedinicaMjere(i)

        })
    }

    async function promijeni(jedinicaMjere) {
        const odgovor = await JedinicaMjereService.get()
        const jediniceMjere = odgovor.data
        const ocisceniNaziv = jedinicaMjere.naziv.trim()
        const postoji = jediniceMjere.some(j =>
            String(j.id) !== String(params.id) &&
            j.naziv.trim().toLocaleLowerCase('hr') ===
            ocisceniNaziv.toLocaleLowerCase('hr')
        )
        if (postoji) {
            setGreska('Jedinica mjere s tim nazivom već postoji!')
            return
        }
        await JedinicaMjereService.promijeni(params.id, {
            naziv: ocisceniNaziv,
            generirano: jedinicaMjere.generirano
        })
        navigate(RouteNames.JEDINICE_MJERE)

    }

    function odradiSubmit(e) {
        e.preventDefault()
        setGreska("")

        const podaci = new FormData(e.target)
        const naziv = podaci.get('naziv').trim()
        if (!naziv) {
            setGreska('Unesite naziv jedinice mjere')
            return
        }
        promijeni({ naziv, generirano: jedinicaMjere.generirano })
    }

    return (
        <>
            <h3>
                Promijeni JM
            </h3>
            <Form onSubmit={odradiSubmit}>
{greska && (<Alert variant="danger">{greska}</Alert>)}
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv JM</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required
                        defaultValue={jedinicaMjere?.naziv || ""} />
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

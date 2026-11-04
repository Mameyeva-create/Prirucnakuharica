
import { Link, useNavigate } from "react-router-dom";
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService";
import { RouteNames } from "../../constants";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useState } from "react";

export default function JedinicaMjereNovi() {
    const navigate = useNavigate()
    const [naziv, setNaziv] = useState("")
    const [greska, setGreska] = useState("")

    async function odradiSubmit(e) {
        e.preventDefault()
        setGreska("")

        const ocisceniNaziv = naziv.trim()

        if (!ocisceniNaziv) {
            setGreska('Unesite naziv jedinice mjere')
            return
        }
        try {
            // Dohvat svih jedinica mjere
            const odgovor = await JedinicaMjereService.get()
            const jediniceMjere = odgovor.data

            // Provjera duplikata
            const postoji = jediniceMjere.some(j =>
                j.naziv.trim().toLocaleLowerCase('hr') ===
                ocisceniNaziv.toLocaleLowerCase('hr')
            )
            if (postoji) {
                setGreska('Jedinica mjere s tim nazivom već postoji!')
                return
            }

            await JedinicaMjereService.dodaj({
                naziv: naziv.trim()
            })
            navigate(RouteNames.JEDINICE_MJERE)
        } catch (error) {
            setGreska(error.message)
        }
    }
    return (
        <div className="container mt-4">
            <Card className="shadow-sm">
                <Card.Header><h3 className="mb-0">Dodaj jedinicu mjere ⚖️</h3></Card.Header>
                <Card.Body>
                    {greska && (
                        <Alert variant="danger">{greska}</Alert>
                    )}
                    <Form onSubmit={odradiSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Naziv jedinice mjere</Form.Label>
                            <Form.Control type="text"
                                value={naziv}
                                onChange={(e) => setNaziv(e.target.value)}
                                placeholder="npr. čašica" required />
                        </Form.Group>
                        <Button type="submit" variant="success">
                            Spremi jedinicu mjere
                        </Button>{" "}
                        <Link to={RouteNames.JEDINICE_MJERE}
                            className="btn btn-danger">
                            Odustani
                        </Link>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

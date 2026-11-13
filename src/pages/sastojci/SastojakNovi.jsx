
import { Link, useNavigate } from "react-router-dom";
import SastojakService from "../../services/sastojci/SastojakService";
import { RouteNames } from "../../constants";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useState } from "react";
import { sastojakSchema, validiraj } from "../../validacije";


export default function SastojakNovi() {
    const navigate = useNavigate()
    const [naziv, setNaziv] = useState("")
    const [greska, setGreska] = useState("")

    async function odradiSubmit(e) {
        e.preventDefault()
        setGreska("")

        const rezultat = validiraj(sastojakSchema, { naziv })
        if (!rezultat.ok) {
            setGreska(rezultat.greska)
            return
        }
        const ocisceniNaziv = rezultat.data.naziv

        try {
            // Dohvat svih sastojaka
            const odgovor = await SastojakService.get()
            const sastojci = odgovor.data

            // Provjera duplikata
            const postoji = sastojci?.some(s =>
                s.naziv?.trim().toLocaleLowerCase('hr') ===
                ocisceniNaziv.toLocaleLowerCase('hr')
            )
            if (postoji) {
                setGreska('Sastojak s tim nazivom već postoji!')
                return
            }
            // Dodavanje novog sastojka
            await SastojakService.dodaj({
                naziv: ocisceniNaziv,
                generirano: false
            })
            navigate(RouteNames.SASTOJCI)
        } catch (error) {
            setGreska(error.message)
        }
    }
    return (
        <div className="container mt-4">
            <Card className="shadow-sm">
                <Card.Header><h3 className="mb-0">Dodaj sastojak 🌿</h3></Card.Header>
                <Card.Body>
                    {greska && (
                        <Alert variant="danger">{greska}</Alert>
                    )}
                    <Form onSubmit={odradiSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Naziv sastojka</Form.Label>
                            <Form.Control type="text"
                                value={naziv}
                                onChange={(e) => setNaziv(e.target.value)}
                                placeholder="npr.Brašno" required />
                        </Form.Group>
                        <Button type="submit" variant="success">
                            Spremi sastojak
                        </Button>{" "}
                        <Link to={RouteNames.SASTOJCI}
                            className="btn btn-danger">
                            Odustani
                        </Link>
                    </Form>
                </Card.Body>
            </Card>
            <div className="ilustracija-dodaj-sastojak">
                <img src='/slike/dodajSastojak.png'
                    alt="Dodaj sastojak" />
            </div>
        </div>
    )
}

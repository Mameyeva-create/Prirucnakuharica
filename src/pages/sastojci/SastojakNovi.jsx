
import { Link, useNavigate } from "react-router-dom";
import SastojakService from "../../services/sastojci/SastojakService";
import { RouteNames } from "../../constants";
import { Alert, Button, Form } from "react-bootstrap";
import { useState } from "react";


export default function SastojakNovi() {
    const navigate = useNavigate()
    const [naziv, setNaziv] = useState("")
    const [greska, setGreska] = useState("")

     async function odradiSubmit(e) {
        e.preventDefault()
        setGreska("")

        try {
           await SastojakService.dodaj({
            naziv: naziv.trim()
        })
            navigate(RouteNames.RECEPTI)
        } catch (error) {
            setGreska(error.message)
        }
    }
    return (
        <div className="container mt-4">
            <h3>Dodaj satojak</h3>
            {greska && (
                <Alert variant="danger">{greska}</Alert>
            )}
            <Form onSubmit={odradiSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Naziv sastojka</Form.Label>
                    <Form.Control type="text"
                        value={naziv}
                        onChange={(e) => setNaziv(e.target.value)}
                        placeholder="npr.Brašno" required
                    />
                </Form.Group>
                <Button type="submit" variant="success">
                    Spremi sastojak
                </Button>{" "}
                <Link to={RouteNames.RECEPTI}
                className="btn btn-danger">
                    Odustani
                </Link>
            </Form>
        </div>
    )}

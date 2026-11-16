import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap"
import OperaterService from "../../services/operateri/OperaterService"
import { useAuth } from "../../context/AuthContext"
import { ShemaMojaLozinka } from "../../schemas/ShemaOperater"
import { RouteNames } from "../../constants"

export default function MojaLozinka() {
    const navigate = useNavigate()
    const { prijavljeniOperater } = useAuth()
    const [errors, setErrors] = useState({})

    async function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        setErrors({})

        const rezultat = ShemaMojaLozinka.safeParse(Object.fromEntries(podaci))
        if (!rezultat.success) {
            const noveGreske = {}
            rezultat.error.issues.forEach((issue) => {
                const kljuc = issue.path[0]
                if (!noveGreske[kljuc]) noveGreske[kljuc] = issue.message
            })
            setErrors(noveGreske)
            return
        }

        // Provjera trenutne lozinke
        const provjera = await OperaterService.prijava(
            prijavljeniOperater.email,
            rezultat.data.staraLozinka
        )
        if (!provjera.success) {
            setErrors({ staraLozinka: 'Trenutna lozinka nije ispravna!' })
            return
        }

        const promjena = await OperaterService.promjeniLozinku(
            prijavljeniOperater.id,
            rezultat.data.novaLozinka
        )
        if (promjena.success) {
            alert('Lozinka uspješno promijenjena!')
            navigate(RouteNames.HOME)
        } else {
            alert(promjena.message || 'Greška pri promjeni lozinke')
        }
    }

    const ocistiGresku = (naziv) => {
        if (errors[naziv]) {
            const noveGreske = { ...errors }
            delete noveGreske[naziv]
            setErrors(noveGreske)
        }
    }

    return (
        <>
            <h3>Promjena lozinke</h3>
            <Form onSubmit={odradiSubmit}>
                <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">
                                Račun: <strong>{prijavljeniOperater?.email}</strong>
                            </Card.Title>

                            {[
                                ['staraLozinka', 'Trenutna lozinka'],
                                ['novaLozinka', 'Nova lozinka'],
                                ['potvrdaLozinke', 'Potvrda nove lozinke'],
                            ].map(([naziv, oznaka]) => (
                                <Row key={naziv}>
                                    <Col xs={12}>
                                        <Form.Group controlId={naziv} className="mb-3">
                                            <Form.Label className="fw-bold">{oznaka}</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name={naziv}
                                                isInvalid={!!errors[naziv]}
                                                onFocus={() => ocistiGresku(naziv)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors[naziv]}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            ))}
                            <Form.Text className="text-muted">
                                Nova lozinka: najmanje 8 znakova, veliko i malo slovo, broj i interpunkcijski znak.
                            </Form.Text>

                            <hr />
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to="/moj-profil" className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Promijeni lozinku
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { RouteNames } from '../../constants'

const DEMO_RACUNI = [
    { naslov: 'Klikni za Admina', email: 'admin@edunova.hr', lozinka: 'Edunova123!' },
    { naslov: 'Klikni za Korisnika', email: 'operater@edunova.hr', lozinka: 'Edunova123!' },
]

function Prijava() {

    const { prijava, jePrijavljen } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [lozinka, setLozinka] = useState('')
    const [poruka, setPoruka] = useState('')
    const [ucitavanje, setUcitavanje] = useState(false)

    // Ako je korisnik već prijavljen, vrati ga na početnu
    useEffect(() => {
        if (jePrijavljen) {
            navigate(RouteNames.HOME, { replace: true })
        }
    }, [jePrijavljen, navigate])

    async function obradiPrijavu(e) {
        e.preventDefault()

        setPoruka('')
        setUcitavanje(true)
        try {
            const rezultat = await prijava(email.trim(), lozinka)

            if (rezultat.success) {
                navigate(RouteNames.HOME)
            } else {
                setPoruka(rezultat.message || 'Prijava nije uspjela')
            }
        } catch (error) {
            setPoruka('Došlo je do pogreške prilikom prijave')
        } finally {
            setUcitavanje(false)
        }
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={7} lg={5}>

                    <Card className="shadow-sm">
                        <Card.Body className="p-4">

                            <h2 className="text-center mb-4">
                                Prijava
                            </h2>
                            <Row className="mb-3 g-2">
                                {DEMO_RACUNI.map((racun) => (
                                    <Col xs={12} sm={6} key={racun.email}>
                                        <Card
                                            className="p-2 bg-light text-center"
                                            style={{ cursor: 'pointer', borderStyle: 'dashed' }}
                                            onClick={() => {
                                                setEmail(racun.email)
                                                setLozinka(racun.lozinka)
                                                setPoruka('')
                                            }}
                                        >
                                            <small className="text-muted">{racun.naslov}</small>
                                            <div className="fw-bold">{racun.email}</div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            {poruka && (
                                <Alert variant="danger">
                                    {poruka}
                                </Alert>
                            )}

                            <Form onSubmit={obradiPrijavu}>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Unesite email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Lozinka</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Unesite lozinku"
                                        value={lozinka}
                                        onChange={(e) => setLozinka(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100"
                                    disabled={ucitavanje}
                                    style={{
                                        backgroundColor: '#35483b',
                                        borderColor: '#35483b'
                                    }}
                                >
                                    {ucitavanje ? 'Prijava...' : 'Prijavi se'}
                                </Button>

                            </Form>
                            <p className="mt-3">
                                Nemate račun? <Link to={RouteNames.REGISTRACIJA}>Registrirajte se</Link>
                            </p>
                        </Card.Body>
                    </Card>

                </Col>
            </Row>
        </Container>
    )
}

export default Prijava

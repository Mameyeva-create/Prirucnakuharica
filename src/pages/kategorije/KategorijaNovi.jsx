import { Link, useNavigate } from "react-router-dom";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { kategorijaSchema, validiraj } from "../../validacije";
import { useRive } from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';

export default function KategorijaNovi() {
    const navigate = useNavigate()
    const [status, setStatus] = useState('idle') // idle | loading | success | error

    const { rive, RiveComponent } = useRive({
    src: '/sobo.riv',
    stateMachine: 'State Machine 1',
    autoplay: true,
})

    // При смене статуса — перезапускаем анимацию
    useEffect(() => {
        if (!rive) return

        if (status === 'success' || status === 'error' || status === 'loading') {
            rive.reset()
            rive.play()
        }
    }, [status, rive])

    async function odradiSubmit(e) {
        e.preventDefault()

        const podaci = new FormData(e.target)
        const rezultat = validiraj(kategorijaSchema, { naziv: podaci.get('naziv') ?? '' })

        if (!rezultat.ok) {
            setStatus('error')
            alert(rezultat.greska)
            return
        }

        setStatus('loading')

        const kategorija = { ...rezultat.data, generirano: false }

        try {
            await KategorijaService.dodaj(kategorija)
            setStatus('success')

            // Даём анимации немного отыграть
            setTimeout(() => {
                navigate(RouteNames.KATEGORIJE)
            }, 1000)

        } catch (greska) {
            console.error('Greška pri dodavanju kategorije:', greska)
            setStatus('error')
            alert('Kategorija nije dodana. Provjeri konzolu')
        }
    }

    return (
        <div className="px-4 py-3 d-flex flex-column" style={{ minHeight: '80vh' }}>
            <div>
                <h3>Unos nove kategorije 🍽️</h3>

                <Form onSubmit={odradiSubmit}>
                    <Form.Group controlId="naziv" className="mb-3">
                        <Form.Label>Naziv kategorije</Form.Label>
                        <Form.Control type="text" name="naziv" required />
                    </Form.Group>

                    <Row className="g-2">
                        <Col>
                            <Link to={RouteNames.KATEGORIJE} className="btn btn-danger">
                                Odustani
                            </Link>
                        </Col>
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="btn-dodaj-ketegoriju"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Spremanje...' : 'Dodaj novu kategoriju'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>

            {/* Анимация снизу по центру */}
            <div className="mt-auto d-flex justify-content-center pb-4">
                <div style={{ width: 260, height: 260 }}>
                    <RiveComponent />
                </div>
            </div>
        </div>
    )
}
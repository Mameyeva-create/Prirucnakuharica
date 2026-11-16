import { useState } from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap'
import { DATA_SOURCE } from '../constants'
import GeneriranjeJedinicaMjere from '../pages/jedinicaMjere/GeneriranjeJedinicaMjere'
import GeneriranjeSastojaka from '../pages/sastojci/GeneriranjeSastojaka'
import GeneriranjeKategorija from '../pages/kategorije/GeneriranjeKategorija'
import GeneriranjeRecepata from '../pages/recepti/GeneriranjeRecepata'
import GeneriranjeOperatera from '../pages/operateri/GeneriranjeOperatera'
import { kategorije } from '../services/kategorije/KategorijaPodaci'
import { jediniceMjere } from '../services/jedinicaMjere/JedinicaMjerePodaci'
import { sastojci } from '../services/sastojci/SastojakPodaci'
import { operateri } from '../services/operateri/OperaterPodaci'
import { recepti } from '../services/recepti/ReceptPodaci'

const KARTICE = [
    GeneriranjeJedinicaMjere,
    GeneriranjeSastojaka,
    GeneriranjeKategorija,
    GeneriranjeRecepata,
    GeneriranjeOperatera,
]

export default function GeneriranjePodataka() {
    const [poruka, setPoruka] = useState(null)
    function presipaj() {
        if (!window.confirm('Presipati sve podatke iz memorije u localStorage? Postojeći podaci bit će zamijenjeni.')) {
            return
        }
        try {
            // Slike u base64 su velike (limit localStorage je oko 5 MB), pa se kopira samo putanja
            const receptiBezSlika = recepti.map(({ slikaBase64, ...ostalo }) => ostalo)

            localStorage.setItem('kategorije', JSON.stringify(kategorije))
            localStorage.setItem('jediniceMjere', JSON.stringify(jediniceMjere))
            localStorage.setItem('sastojci', JSON.stringify(sastojci))
            localStorage.setItem('operateri', JSON.stringify(operateri))
            localStorage.setItem('recepti', JSON.stringify(receptiBezSlika))

            setPoruka({ tip: 'success', tekst: 'Uspješno presipano!' })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri presipavanju: ' + error.message })
        }
    }

    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <h2 className="text-center mb-4">Generiranje podataka</h2>
            <Row className="g-4 align-items-stretch">
                {KARTICE.map((Kartica, i) => (
                    <Col xs={12} md={6} key={i}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body>
                                <Kartica />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {DATA_SOURCE.trim() === 'memorija' && (
                <>
                    <hr className="my-4" />
                    <h3>Presipavanje podataka</h3>
                    <p className="text-muted">
                        Kopira trenutne podatke iz memorije u localStorage.
                    </p>
                    <Button variant="danger" onClick={presipaj}>Presipaj</Button>
                    {poruka && (
                        <Alert variant={poruka.tip} className="mt-3">{poruka.tekst}</Alert>
                    )}
                </>
            )}
        </div>
    )
}
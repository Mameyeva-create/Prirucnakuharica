import { Card, Col, Row } from 'react-bootstrap'
import GeneriranjeJedinicaMjere from '../pages/jedinicaMjere/GeneriranjeJedinicaMjere'
import GeneriranjeSastojaka from '../pages/sastojci/GeneriranjeSastojaka'
import GeneriranjeKategorija from '../pages/kategorije/GeneriranjeKategorija'
import GeneriranjeRecepata from '../pages/recepti/GeneriranjeRecepata'

const KARTICE = [
    GeneriranjeJedinicaMjere,
    GeneriranjeSastojaka,
    GeneriranjeKategorija,
    GeneriranjeRecepata,
]

export default function GeneriranjePodataka() {
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
        </div>
    )
}
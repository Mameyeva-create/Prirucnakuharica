import { Card, Col, Row } from "react-bootstrap"
import GeneriranjeRecepta from "../pages/recepti/GeneriranjeRecepta"
import GeneriranjeKategorija from '../pages/kategorije/GeneriranjeKategorija'


export default function GeneriranjePodataka() {
    return (
        <div className="container-fluid px-3 px-md py-4">
            <h2 className="text-center mb-4">
                Generiranje podatka
            </h2>
            <Row className='g-4 align-items-stretch'>
                <Col xs={12} md={6}>
                    <Card className='h-100 shadow-sm border-0'>
                        <Card.Body>
                            <GeneriranjeKategorija />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Body>
                            <GeneriranjeRecepta />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
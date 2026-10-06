import { use, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReceptService from "../../services/recepti/ReceptService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";


export default function ReceptPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [recept, setRecept] = useState({})
    const [omiljen, setOmiljen] = useState(false)
    const [vegansko, setVegansko] = useState(false)

    useEffect(() => {
        ucitajRecept()
    }, [])

    async function ucitajRecept() {
        await ReceptService.getById(params.id).then((odgovor) => {
            const i = odgovor.data
            setRecept(i)
            setOmiljen(i.omiljen)
            setVegansko(i.vegansko)

        })
    }

    async function promijeni(recept) {
        await ReceptService.promijeni(params.id, recept).then(() => {
            navigate(RouteNames.RECEPTI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()

        const podaci = new FormData(e.target)

        promijeni({
            naziv: podaci.get('naziv'),
            kategorija: podaci.get('kategorija'),
            vrijeme: parseInt(podaci.get('vrijeme')),
            opis: podaci.get('opis'),
            omiljen: omiljen,
            vegansko: vegansko
        })
    }

    return (
        <>
            <h3>
                Promijeni recept
            </h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv recepta</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required 
                        defaultValue={recept.naziv}/>
                </Form.Group>

                <Form.Group controlId="kategorija">
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Control type="text"
                        name="kategorija" required
                        defaultValue={recept.kategorija} />
                </Form.Group>

                <Form.Group controlId="vrijeme">
                    <Form.Label>Vrijeme</Form.Label>
                    <Form.Control type="number"
                        name="vrijeme" step={1} required 
                        defaultValue={recept.vrijeme}/>
                </Form.Group>

                <Form.Group controlId="opis">
                    <Form.Label>Opis recepta</Form.Label>
                    <Form.Control as="textarea"
                        name="opis" rows={4} required 
                        defaultValue={recept.opis}/>
                </Form.Group>

                <Form.Group controlId="omiljen" className="mt-3">
                    <Form.Check label="Dodaj u omiljene ❤️"
                        name="omiljen"
                        checked={omiljen}
                        onChange={(e)=>setOmiljen(e.target.checked)}
                    />
                </Form.Group>


                <Form.Group controlId="vegansko" className="mt-3">
                    <Form.Check label="Dodaj u vegansko 🌱"
                        name="vegansko"
                        checked={vegansko}
                        onChange={(e)=>setVegansko(e.target.checked)}
                    />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.RECEPTI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promijeni recept
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

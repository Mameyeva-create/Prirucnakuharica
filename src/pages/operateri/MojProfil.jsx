import { Link } from "react-router-dom"
import { Card, Container } from "react-bootstrap"
import { useAuth } from "../../context/AuthContext"

export default function MojProfil() {
    const { prijavljeniOperater } = useAuth()

    return (
        <>
            <h3 className="mt-4 px-3">Moj profil</h3>
            <Container className="mt-4">
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="mb-4">Podaci o računu</Card.Title>
                        <p><strong>Email:</strong> {prijavljeniOperater?.email}</p>
                        <p>
                            <strong>Uloga:</strong>{' '}
                            <span className={`badge ${prijavljeniOperater?.uloga === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                {prijavljeniOperater?.uloga}
                            </span>
                        </p>
                        <Link to="/promjena-lozinke" className="btn btn-outline-warning">
                            🔒 Promjena lozinke
                        </Link>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}
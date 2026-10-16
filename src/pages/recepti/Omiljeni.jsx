import { useEffect, useState } from "react";
import ReceptService from "../../services/recepti/ReceptService";
import { Card, Table } from "react-bootstrap";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link, useNavigate } from "react-router-dom";


export default function Omiljeni() {

    const [recepti, setRecepti] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        ucitajOmiljene()
    }, [])

    async function ucitajOmiljene() {
        const odgovor = await ReceptService.get()
        const omiljeni = odgovor.data.filter(recept => recept.omiljen === true)
        setRecepti(omiljeni)
    }

    function otvoriRecept(id) {
        navigate(`/recepti/${id}/detalji`)
    }

    return (
        <>
            <div className="d-none d-md-block table-responsive">
                <Table hover striped className="table-recepti">
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Kategorija</th>
                            <th>Vrijeme</th>
                            <th>Opis</th>
                            <th>Omiljen</th>
                            <th>Vegansko</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recepti.map((recept) => (
                            <tr key={recept.id}
                                onClick={() => otvoriRecept(recept.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td className="lead">
                                    <Link to={`/recepti/${recept.id}/detalji`}
                                        style={{
                                            color: '#35483b',
                                            fontWeight: 'bold',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {recept.naziv}
                                    </Link>
                                </td>
                                <td>{recept.kategorija}</td>
                                <td className="text-end">{recept.vrijeme} min</td>
                                <td>{recept.opis}</td>
                                <td>❤️</td>
                                <td>{recept.vegansko ? '🌱' : ''}</td>
                            </tr>
                        ))}

                        {recepti.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Još nema omiljenih recepata
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Kartice za mobitel */}
            <div className="d-md-none p-2">
                {recepti.map((recept) => (
                    <Card key={recept.id}
                        className='mb-3 shadow-sm omiljeni-kartica'
                        onClick={() => otvoriRecept(recept.id)}
                        role='link'
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === " ") {
                                e.preventDefault()
                                otvoriRecept(recept.id)
                            }
                        }}
                    >
                        <Card.Body>
                            <Card.Title>
                                <Link to={`/recepti/${recept.id}/detalji`}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        color: '#35483b',
                                        fontWeight: 'bold',
                                        textDecoration: 'none'
                                    }}
                                >{recept.naziv}</Link>
                            </Card.Title>

                            <Card.Subtitle className='mb-2 text-muted'>
                                {recept.kategorija} · {recept.vrijeme} min
                            </Card.Subtitle>
                            <Card.Text>{recept.opis || 'Nema opisa recepta'}</Card.Text>

                            <div className="d-flex gap-3">
                                <span>❤️ Omiljen</span>{recept.vegansko && (
                                    <span>🌱 Vegansko</span>
                                )}
                            </div>
                            {/* <div className="mt-2 text-muted small">
                                Dodirni karticu za otvaranje recepta</div> */}
                        </Card.Body>
                    </Card>
                ))}
                {recepti.length === 0 && (
                    <p className="text-center my-4">Još nema omiljenih recepata</p>
                )}
</div>

            <div style={{ maxWidth: '700px', margin: '100px auto 0', textAlign: 'center' }}>
                <DotLottieReact
                    src='/heart.lottie'
                    loop
                    autoplay />
            </div>
        </>
    )
}
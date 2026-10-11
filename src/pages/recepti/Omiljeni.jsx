import { useEffect, useState } from "react";
import ReceptService from "../../services/recepti/ReceptService";
import { Table } from "react-bootstrap";
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

    return (
        <>
            <div className="table-responsive">
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
                            onClick={() => navigate(`/recepti/${recept.id}/detalji`)}
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
            <div style={{ maxWidth: '700px', margin: '100px auto 0', textAlign: 'center' }}>
                <DotLottieReact
                    src='/heart.lottie'
                    loop
                    autoplay />
            </div>
        </>
    )
}
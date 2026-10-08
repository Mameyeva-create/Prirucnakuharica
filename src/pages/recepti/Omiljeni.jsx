import { useEffect, useState } from "react";
import ReceptService from "../../services/recepti/ReceptService";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


export default function Omiljeni() {

    const [recepti, setRecepti] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        ucitajOmiljene()
    }, [])

    async function ucitajOmiljene() {

        await ReceptService.get().then((odgovor) => {

            const omiljeni = odgovor.data.filter(recept => recept.omiljen === true)
            setRecepti(omiljeni)
        })
    }

    return (
        <>
            <div className="table-responsive">
                <Table hover striped>
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Kategorija</th>
                            <th>Vrijeme</th>
                            <th>Opis</th>
                            <th>Omiljen</th>
                            <th>Vegansko</th>
                            {/* <th>Akcija</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {recepti.map((recept) => (
                            <tr key={recept.id}>
                                <td className="lead">{recept.naziv}</td>
                                <td>{recept.kategorija}</td>
                                <td className="text-end">{recept.vrijeme} min</td>
                                <td>{recept.opis}</td>
                                <td>❤️</td>
                                <td>{recept.vegansko ? '🌱' : ''}</td>
                            </tr>

                        ))}
                    </tbody>
                </Table>
            </div>
            <div style={{ maxWidth: '700px', margin: '300px auto 0', textAlign: 'center' }}>
                <DotLottieReact
                    src='/heart.lottie'
                    loop
                    autoplay />
            </div>
        </>
    )
}
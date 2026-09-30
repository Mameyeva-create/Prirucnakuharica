import { useEffect, useState } from "react";
import ReceptService from "../../services/recepti/ReceptService";
import { Table } from "react-bootstrap";



export default function Omiljeni() {

    const [recepti, setRecepti] = useState([])

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
            <Table hover striped>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Kategorija</th>
                        <th>Vrijeme</th>
                        <th>Opis</th>
                        <th>Omiljen</th>
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
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
import { useEffect, useState } from "react";
import ReceptService from "../../services/recepti/ReceptService";
import { Table } from "react-bootstrap";



export default function Vegansko() {

    const [recepti, setRecepti] = useState([])

    useEffect(() => {
        ucitajVegansko()
    }, [])

    async function ucitajVegansko() {

        await ReceptService.get().then((odgovor) => {

            const vegansko = odgovor.data.filter(recept => recept.vegansko === true)
            setRecepti(vegansko)
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
                        <th>Vegansko</th>
                    </tr>
                </thead>

                <tbody>
                    {recepti.map((recept) => (
                        <tr key={recept.id}>
                            <td className="lead">{recept.naziv}</td>
                            <td>{recept.kategorija}</td>
                            <td className="text-end">{recept.vrijeme} min</td>
                            <td>{recept.opis}</td>
                            <td> 🌱 </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
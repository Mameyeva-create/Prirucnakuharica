import { useEffect, useState } from "react"
import ReceptService from "../../services/recepti/ReceptService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { RouteNames } from "../../constants"


export default function ReceptPregled() {

    const [recepti, setRecepti] = useState([])
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const kategorija = searchParams.get('kategorija')
    const samoVegansko = searchParams.get('vegansko') === 'true'

    useEffect(() => {
        // console.log('Dosla na pregled recepta')
        ucitajRecepti()
    }, [])


    async function ucitajRecepti() {
        await ReceptService.get().then((odgovor) => {
            // console.table(odgovor.data)
            setRecepti(odgovor.data)
        })
    }

    const prikazaniRecepti = recepti.filter((recept) => {
        if (samoVegansko) {
            return recept.vegansko === true
        }
        if (kategorija) {
            return recept.kategorija === kategorija
        }
        return true
    })

    return (
        <>
            <Link to={RouteNames.RECEPTI_NOVI}
                className="btn btn-success w-100 my-3">
                Ovdje Pretraži recept
            </Link>

            <Table hover striped className="table-recepti">
                <thead>
                    <tr>
                    <th>Naziv</th>
                    <th>Kategorija</th>
                    <th>Vrijeme</th>
                    <th>Opis</th>
                    <th>Omiljen</th>
                    <th>Vegansko</th>
                    <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {prikazaniRecepti && prikazaniRecepti.map((recept) => ( */}
                    {prikazaniRecepti.map((recept) => (
                        <tr key={recept.id}>
                            <td className="lead">{recept.naziv}</td>
                            <td>{recept.kategorija}</td>
                            <td className="text-end">{recept.vrijeme} min</td>
                            <td>{recept.opis}</td>
                            <td>
                                {recept.omiljen ? '❤️' : ''}
                            </td>
                            <td> {recept.vegansko ? '🌱' : ''} </td>
                            <td>
                                <Button className="btn-promijeni" 
                                onClick={() => { navigate(`/recepti/${recept.id}`) }}>
                                    Promjeni
                                </Button>
                            </td>
                        </tr>
                    ))}

                    {prikazaniRecepti.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center">Nema recepata u ovaj kategoriji</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* {JSON.stringify(recept,null,2)} */}
        </>
    )
}
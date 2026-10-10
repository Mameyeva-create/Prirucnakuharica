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
    const trazi = (searchParams.get('trazi') || '')
    .trim()
    .toLocaleLowerCase('hr')

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

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati')) {
            return
        }
        await ReceptService.obrisi(id)
        ucitajRecepti()
    }

    const prikazaniRecepti = recepti.filter((recept) => {
        if (samoVegansko && recept.vegansko !== true) {
            return false
        }
        if (kategorija && recept.kategorija !== kategorija) {
            return false
        }

        const tekstRecepta = [
            recept.naziv,
            recept.opis,
            recept.sastojci
        ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('hr')

        if (trazi && !tekstRecepta.includes(trazi)) {
            return false
        }

        return true
    })

    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: '1100px' }}>
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
                                <th>Sastojci</th>
                                <th>Omiljen</th>
                                <th>Vegansko</th>
                                <th>Akcija</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prikazaniRecepti.map((recept) => (
                                <tr key={recept.id}>
                                    <td className="lead">{recept.naziv}</td>
                                    <td>{recept.kategorija}</td>
                                    <td className="text-end">{recept.vrijeme} min</td>
                                    <td>{recept.opis}</td>
                                     <td>{recept.sastojci || '-'}</td>
                                    <td>
                                        {recept.omiljen ? '❤️' : ''}
                                    </td>
                                    <td> {recept.vegansko ? '🌱' : ''} </td>
                                    <td style={{ minWidth: '220px', whiteSpace: 'nowrap' }}>
                                        <Button className="btn-promijeni"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => { navigate(`/recepti/${recept.id}`) }}>
                                            Promjeni
                                        </Button>
                                        {/* &nbsp;&nbsp; */}
                                        <Button variant="danger" onClick={() => obrisi(recept.id)}>
                                            Obriši
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {prikazaniRecepti.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center">{trazi
                                        ? `Nema recepata za: ${trazi}`
                                        : 'Nema recepata u ovoj kategoriji'
                                        }</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
            {/* {JSON.stringify(recept,null,2)} */}
        </>
    )
}
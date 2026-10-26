import { useEffect, useState } from "react"
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"


export default function JedinicaMjerePregled() {
    const [jediniceMjere, setJediniceMjere] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // console.log('Dosla na pregled JedinicaMjerea')
        ucitajJediniceMjere()
    }, [])


    async function ucitajJediniceMjere() {
        const odgovor = await JedinicaMjereService.get()
        // console.table(odgovor.data)
        setJediniceMjere(odgovor.data)
    }

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        await JedinicaMjereService.obrisi(id)
        ucitajJediniceMjere()
    }

    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                
                    <Link to={RouteNames.JEDINICE_MJERE_NOVI}
                        className="btn btn-success w-100 my-3"
                        style={{
                            display: 'block',
                            boxSizing: 'border-box',
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word'
                        }}>
                        Dodavanje nove jediniceMjere
                    </Link>
                    <div style={{ width: '100%' }}>


                    <Table hover striped className="table-jediniceMjere">
                        <thead>
                            <tr>
                                <th>Naziv</th>
                                <th className="text-end">Akcija</th>
                            </tr>
                        </thead>

                        <tbody>
                            {jediniceMjere.map((jedinicaMjere) => (
                                <tr key={jedinicaMjere.id}>
                                    <td className="lead">
                                        {jedinicaMjere.naziv}
                                    </td>

                                    <td className="text-end"
                                    style={{ minWidth: '190px', whiteSpace: 'nowrap' }}>

                                        <Button className="btn-promijeni me-2"
                                            onClick={(e) => {
                                                navigate(`/jediniceMjere/${jedinicaMjere.id}`)
                                            }}>
                                            Promjeni
                                        </Button>
                                        {/* &nbsp;&nbsp; */}
                                        <Button variant="danger" onClick={(e) => {
                                            obrisi(jedinicaMjere.id)
                                        }}>
                                            Obriši
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                           
                        </tbody>
                    </Table>
                </div>
           </div>
        </>
    )
}
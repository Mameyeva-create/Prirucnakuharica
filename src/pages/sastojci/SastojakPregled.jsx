import { useEffect, useState } from "react"
import SastojakService from "../../services/sastojci/SastojakService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"


export default function SastojakPregled() {
    const [sastojci, setSastojci] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // console.log('Dosla na pregled Sastojaka')
        ucitajSastojci()
    }, [])


    async function ucitajSastojci() {
        const odgovor = await SastojakService.get()
        // console.table(odgovor.data)
        setSastojci(odgovor.data)
    }

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        await SastojakService.obrisi(id)
        ucitajSastojci()
    }

    return (
        <>
            {/* <div style={{ overflowX: 'auto' }}> */}
            <div className="naslov-recepti my-2 px-3 py-2">
                <h2>Svi sastojci</h2>
                <p>Ukupno pronađenih sastojaka: {sastojci.length}</p>
            </div>
            {/* <Link to={RouteNames.KATEGORIJE_NOVI}
                        className="btn btn-success w-100 my-3"
                        style={{
                            display: 'block',
                            boxSizing: 'border-box',
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word'
                        }}>
                        Dodavanje nove sastojci
                    </Link> */}
            <div style={{ width: '100%' }}>


                <Table hover striped className="table-sastojci">
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th className="text-end">Akcija</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sastojci.map((sastojak) => (
                            <tr key={sastojak.id}>
                                <td className="lead">
                                    {sastojak.naziv}
                                </td>

                                <td className="text-end"
                                    style={{ minWidth: '190px', whiteSpace: 'nowrap' }}>

                                    <Button className="btn-promijeni me-2"
                                        onClick={(e) => {
                                            navigate(`/sastojci/${sastojak.id}`)
                                        }}>
                                        Promjeni
                                    </Button>
                                    {/* &nbsp;&nbsp; */}
                                    <Button variant="danger" onClick={(e) => {
                                        obrisi(sastojak.id)
                                    }}>
                                        Obriši
                                    </Button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
            </div>
            {/* </div> */}
        </>
    )
}
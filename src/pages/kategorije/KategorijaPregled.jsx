import { useEffect, useState } from "react"
import KategorijaService from "../../services/kategorije/KategorijaService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { RouteNames } from "../../constants"


export default function KategorijaPregled() {
    const [kategorije, setKategorije] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // console.log('Dosla na pregled kategorijaa')
        ucitajKategorije()
    }, [])


    async function ucitajKategorije() {
        const odgovor = await KategorijaService.get()
        // console.table(odgovor.data)
        setKategorije(odgovor.data)
    }

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        await KategorijaService.obrisi(id)
        ucitajKategorije()
    }

    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                
                    <Link to={RouteNames.KATEGORIJE_NOVI}
                        className="btn btn-success w-100 my-3"
                        style={{
                            display: 'block',
                            boxSizing: 'border-box',
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word'
                        }}>
                        Dodavanje nove kategorije
                    </Link>
                    <div style={{ width: '100%' }}>


                    <Table hover striped className="table-kategorije">
                        <thead>
                            <tr>
                                <th>Naziv</th>
                                <th className="text-end">Akcija</th>
                            </tr>
                        </thead>

                        <tbody>
                            {kategorije.map((kategorija) => (
                                <tr key={kategorija.id}>
                                    <td className="lead">
                                        {kategorija.naziv}
                                    </td>

                                    <td className="text-end"
                                    style={{ minWidth: '190px', whiteSpace: 'nowrap' }}>

                                        <Button className="btn-promijeni me-2"
                                            onClick={(e) => {
                                                navigate(`/kategorije/${kategorija.id}`)
                                            }}>
                                            Promjeni
                                        </Button>
                                        {/* &nbsp;&nbsp; */}
                                        <Button variant="danger" onClick={(e) => {
                                            obrisi(kategorija.id)
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
import { useEffect, useState } from "react"
import SastojakService from "../../services/sastojci/SastojakService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import ReceptService from "../../services/recepti/ReceptService"



export default function SastojakPregled() {
    const [sastojci, setSastojci] = useState([])
    const [trazeniPojam, setTrazeniPojam] = useState("")
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

        // Dohvat svih recepata
        const odgovor = await ReceptService.get()
        const recepti = odgovor.data

        // Provjera koristi li se sastojak u nekom receptu
        const koristiSe = recepti.some(recept =>
            recept.sastojci?.some(s => String(s.sastojak) === String(id))
        )
        if (koristiSe) {
            alert('Sastojak se koristi u receptima i ne može se obrisati!')
            return
        }
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        await SastojakService.obrisi(id)
        ucitajSastojci()
    }

    useEffect(() => {

        function pretraziTipkovnicom(e) {

            // Ne pretražuj dok korisnik upisuje u neko polje
            if (
                e.target.matches('input, textarea, select, button, a') ||
                e.target.isContentEditable ||
                e.ctrlKey || e.altKey || e.metaKey
            ) {
                return
            }
            if (e.key === 'Escape') {
                setTrazeniPojam("")
                return
            }
            if (e.key === 'Backspace') {
                setTrazeniPojam(prethodni => prethodni.slice(0, -1))
                return
            }
            if (e.key.length === 1) {
                setTrazeniPojam(prethodni => prethodni + e.key)
            }
        }
        window.addEventListener('keydown', pretraziTipkovnicom)
        return () => {
            window.removeEventListener('keydown', pretraziTipkovnicom)
        }
    }, [])
    const filtriraniSastojci = sastojci.filter(s =>
        s.naziv?.toLocaleLowerCase('hr').includes(
            trazeniPojam.toLocaleLowerCase('hr')
        )
    )
    return (
        <>
            {/* <div style={{ overflowX: 'auto' }}> */}
            <div className="naslov-recepti my-2 px-3 py-2">
                <h2>Svi sastojci</h2>
                <p>Prikazano sastojaka: {filtriraniSastojci.length} / {sastojci.length}</p>
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
                        {filtriraniSastojci.map((sastojak) => (
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
                        {filtriraniSastojci.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center">Nema pronađenih sastojaka</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            {/* </div> */}
        </>
    )
}
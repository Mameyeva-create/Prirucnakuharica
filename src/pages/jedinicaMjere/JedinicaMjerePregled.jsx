import { useEffect, useState } from "react"
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import ReceptService from "../../services/recepti/ReceptService"


export default function JedinicaMjerePregled() {
    const [jediniceMjere, setJediniceMjere] = useState([])
    const [trazeniPojam, setTrazeniPojam] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        // console.log('Dosla na pregled JedinicaMjerea')
        ucitajJediniceMjere()
    }, [])

    useEffect(() => {
        function pretraziTipkovnicom(e) {
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
    async function ucitajJediniceMjere() {
        const odgovor = await JedinicaMjereService.get()
        console.table(odgovor.data)
        setJediniceMjere(odgovor.data)
    }

    async function obrisi(id) {
        // Dohvat svih recepata
        const odgovor = await ReceptService.get()
        const recepti = odgovor.data

        // Provjera koristi li se jedinica mjere u nekom receptu
        const koristiSe = recepti.some(recept =>
            recept.sastojci?.some(s =>
                String(s.jedMjere) === String(id)
            )
        )
        if (koristiSe) {
            alert('Jedinica mjere se koristi u receptima i ne može se obrisati!')
            return
        }
        if (!confirm('Sigurno obrisati?')) {
            return
        }
        await JedinicaMjereService.obrisi(id)
        ucitajJediniceMjere()
    }
    const filtriraneJediniceMjere = jediniceMjere.filter(j =>
        j.naziv?.toLocaleLowerCase('hr').includes(
            trazeniPojam.toLocaleLowerCase('hr')
        )
    )
    return (
        <>
            <div className="naslov-recepti my-2 px-3 py-2">
                <h2>Sve jedinice mjera</h2>
                <p>Prikazano jedinica mjere: {filtriraneJediniceMjere.length} / {jediniceMjere.length}</p>
            </div>

            <div style={{ width: '100%' }}>
                <Table hover striped className="table-jediniceMjere">
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th className="text-end">Akcija</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtriraneJediniceMjere.map((jedinicaMjere) => (
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
                        {filtriraneJediniceMjere.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center">Nema pronađenih jedinica mjere</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    )
}
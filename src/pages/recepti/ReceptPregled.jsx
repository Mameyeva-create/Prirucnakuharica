import { useEffect, useState } from "react"
import ReceptService from "../../services/recepti/ReceptService"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { RouteNames } from "../../constants"


function korijenRijeci(rijec) {
    let rezultat = rijec
        .toLocaleLowerCase('hr')
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    if (rezultat.length > 4 &&
        /[aeiou]$/.test(rezultat)
    ) {
        return rezultat.slice(0, -1)
    }
    return rezultat
}

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
        const odgovor = await ReceptService.get()
        // console.table(odgovor.data)
        setRecepti(odgovor.data)
    }

    async function obrisi(id) {
        if (!confirm('Sigurno obrisati?')) {
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
        const sastojciTekst = Array.isArray(recept.sastojci)
            ? recept.sastojci.join(" ")
            : recept.sastojci || ""

        const tekstRecepta = [
            recept.naziv,
            recept.opis,
            sastojciTekst
        ]
            .filter(Boolean)
            .join(' ')

        if (trazi) {
            const rijeciPretrage = trazi
                .split(/\s+/)
                .map(korijenRijeci)
                .filter(Boolean)
            const rijeciRecepta = tekstRecepta
                .split(/[^\p{L}\p{N}]+/u)
                .filter(Boolean)
                .map(korijenRijeci)
            const pronadjen = rijeciPretrage.every((rijec) =>
                rijeciRecepta.some((rijeciRecepta) =>
                    rijeciRecepta.startsWith(rijec) ||
                    rijec.startsWith(rijeciRecepta)
                )
            )
            if (!pronadjen) return false
        }

        return true
    })

    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: '850px' }}>
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
                            {prikazaniRecepti.map((recept) => (
                                <tr key={recept.id}
                                    onClick={() => navigate(`/recepti/${recept.id}/detalji`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className="lead">
                                        <Link to={`/recepti/${recept.id}/detalji`}
                                            style={{
                                                color: '#35483b',
                                                fontWeight: 'bold',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {recept.naziv}
                                        </Link>
                                    </td>

                                    <td>{recept.kategorija}</td>
                                    <td className="text-end">{recept.vrijeme} min</td>
                                    <td>{recept.opis}</td>
                                    <td>{recept.omiljen ? '❤️' : ''}</td>
                                    <td> {recept.vegansko ? '🌱' : ''} </td>

                                    <td style={{ minWidth: '190px', whiteSpace: 'nowrap' }}>

                                        <Button className="btn-promijeni me-2"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/recepti/${recept.id}`)
                                            }}>
                                            Promjeni
                                        </Button>
                                        {/* &nbsp;&nbsp; */}
                                        <Button variant="danger" onClick={(e) => {
                                            e.stopPropagation(); obrisi(recept.id)
                                        }}>
                                            Obriši
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {prikazaniRecepti.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center">{trazi
                                        ? `Nema recepata za: ${trazi}`
                                        : 'Nema recepata u ovoj kategoriji'}
                                    </td>
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
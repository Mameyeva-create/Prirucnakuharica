import { useEffect, useState } from "react"
import ReceptService from "../../services/recepti/ReceptService"
import { Button, Card, Table } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"



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
    const prikaziGenerirane = searchParams.get('generirani') === 'true'

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
        if (prikaziGenerirane && recept.generirano !== true) {
            return false
        }
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
            <div className="naslov-recepti my-3">
                <h2>Svi recepti</h2>
                <p>Pronađeno recepata: {prikazaniRecepti.length}</p>
            </div>

            <div className="d-none d-md-block">
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <Table hover striped className="table-recepti">
                        <thead>
                            <tr>
                                <th>Naziv</th>
                                <th>Kategorija</th>
                                <th>Vrijeme</th>
                                <th>Opis</th>
                                <th>Omiljen</th>
                                <th>Vegansko</th>
                                <th className="text-end" style={{ width: '1$'}}>Akcija</th>
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
                                    {/* <td className="text-end">{recept.vrijeme} min</td> */}
                                    <td>{recept.vrijeme} min</td>
                                    <td>{recept.opis}</td>
                                    <td>{recept.omiljen ? '❤️' : ''}</td>
                                    <td> {recept.vegansko ? '🌱' : ''} </td>

                                    <td className="text-end align-middle"
                                    style={{ whiteSpace: 'nowrap' }}>

                                        <Button className="btn-promijeni me-2"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/recepti/${recept.id}`)
                                            }}>
                                            Promijeni
                                        </Button>
                                        {/* &nbsp;&nbsp; */}
                                        <Button variant="danger" onClick={(e) => {
                                            e.stopPropagation()
                                            obrisi(recept.id)
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
            {/* KARTICE — mobilna verzija */}
            <div className="d-md-none">
                {prikazaniRecepti.map((recept) => (
                    <Card key={recept.id} className="mb-3 shadow-sm omiljeni-kartica"
                        onClick={() => navigate(`/recepti/${recept.id}/detalji`)}
                        role="link" tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === " ") {
                                e.preventDefault()
                                navigate(`/recepti/${recept.id}/detalji`)
                            }
                        }}
                    >
                        <Card.Body>
                            <Card.Title>
                                <Link to={`/recepti/${recept.id}/detalji`}
                                    style={{
                                        color: '#35483b',
                                        textDecoration: 'none',
                                        fontWeight: 'bold'
                                    }}
                                >{recept.naziv}</Link>
                            </Card.Title>

                            <Card.Subtitle className="mb-2 text-muted">
                                {recept.kategorija} · {recept.vrijeme} min
                            </Card.Subtitle>

                            <Card.Text>
                                {recept.opis || 'Nema opisa recepta'}
                            </Card.Text>

                            <div className="mb-3 d-flex flex-wrap gap-2">
                                {recept.omiljen && <span>❤️ Omiljen</span>}
                                {recept.vegansko && <span>🌱 Vegansko</span>}
                            </div>

                            <Button size="sm"
                                className="btn-promijeni me-2 mb-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/recepti/${recept.id}`)
                                }}
                            >Promijeni</Button>

                            <Button size="sm" variant="danger" className="mb-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    obrisi(recept.id)
                                }}
                            >Obriši</Button>
                        </Card.Body>
                    </Card>
                ))}
                {prikazaniRecepti.length === 0 && (
                    <p className="text-center my-4">
                        {trazi
                            ? `Nema recepata za: ${trazi}`
                            : 'Nema recepata u ovoj kategoriji'}</p>
                )}
            </div>

            {/* {JSON.stringify(recept,null,2)} */}
        </>
    )
}
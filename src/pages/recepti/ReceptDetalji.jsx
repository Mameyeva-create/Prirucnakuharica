import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReceptService from "../../services/recepti/ReceptService"
import { Button, Form } from "react-bootstrap"



export default function ReceptDetalji() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [recept, setRecept] = useState(null)
    const [porcije, setPorcije] = useState(2)

    useEffect(() => {
        async function ucitajRecept() {
            const odgovor = await ReceptService.getById(id)
            setRecept(odgovor.data)
        }

        ucitajRecept()
    }, [id])

    function prilagodiKolicinu(sastojak) {
        const rezultat = sastojak.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/)

        if (!rezultat) {
            return sastojak
        }

        const kolicina = parseFloat(
            rezultat[1].replace(",", ".")
        )

        const novaKolicina = kolicina * porcije / 2

        // Prikaži najviše dvije decimale
        const prikazKolicine = Number(novaKolicina.toFixed(2)).toLocaleString("hr-HR")
        return `${prikazKolicine} ${rezultat[2]}`
    }

    if (!recept || !recept.id) {
        return (
            <p className="container mt-4">Recept nije pronađen</p>
        )
    }
    const sastojci = Array.isArray(recept.sastojci)
        ? recept.sastojci : recept.sastojci
            ? recept.sastojci.split(',').map(s => s.trim()) : []

    return (
        <div className="container mt-4 mb-5">
            <div className="row align-items-center g-4 mb-4">
                <div className="col-12 col-md-6">
                    <img
                        className="img-fluid rounded-4 shadow"
                        src={recept.slika} alt={recept.naziv}
                        style={{
                            width: '100%',
                            height: '350px',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                <div className="col-12 col-md-6">
                    <h2>{recept.naziv}</h2>

                    <p><strong>Kategorija:</strong> {recept.kategorija}</p>

                    <p><strong>Vrijeme pripreme:</strong>{" "}
                        {recept.vrijeme} min</p>
                </div>
            </div>
            <h4>Broj porcija</h4>

            <Form.Select value={porcije}
                onChange={(e) => setPorcije(Number(e.target.value))}
                style={{ maxWidth: '220px', marginBottom: '20px' }}
                aria-label="Odaberi broj porcija">

                <option value={2}>2 porcije</option>
                <option value={4}>4 porcije</option>
                <option value={6}>6 porcija</option>
            </Form.Select>

            <h4>Sastojci</h4>

            <ul className="list-unstyled">
                {sastojci.length > 0 ? (
                    sastojci.map((sastojak, index) => (
                        <li key={index} className="mb-2">
                            <span className="me-2">🥄</span>
                            {prilagodiKolicinu(sastojak)}
                        </li>
                    ))
                ) : (<li>Sastojci nisu eneseni</li>
                )}
            </ul>
            <h4>Priprema</h4>

            <p style={{ whiteSpace: 'pre-line' }}>
                {recept.priprema || recept.opis || 'Upute za pripremu još nisu unesene'}
            </p>

            <Button variant="secondary" onClick={() => navigate(-1)}>Natrag</Button>
        </div>
    )
}
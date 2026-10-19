import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReceptService from "../../services/recepti/ReceptService"
import { Button, Form } from "react-bootstrap"
import { slikeRecepata } from "../../services/recepti/slikeRecepata"
import SastojakService from "../../services/SastojakService"

export default function ReceptDetalji() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [recept, setRecept] = useState(null)
    const [porcije, setPorcije] = useState(2)
    const [sviSastojci, setSviSastojci] = useState([])

    async function promjeniOmiljen() {
        const azuriraniRecept = {
            ...recept, omiljen: !recept.omiljen
        }
        try {
            await ReceptService.promijeni(recept.id, azuriraniRecept)
            setRecept(azuriraniRecept)
        } catch (error) {
            console.error('Greška pri promjeni omiljenog recepta', error)
        }
    }

    useEffect(() => {
async function ucitajSastojke() {
    try {
        const podaci = await SastojakService.get()
        setSviSastojci(podaci)
    } catch (error) {
        console.error("Greška pri učinavanju sastojka", error)
    }
}
ucitajSastojke()

        async function ucitajRecept() {
            try {
                const odgovor = await ReceptService.getById(id)
                setRecept(odgovor.data)
            } catch (error) {
                console.error('Greška pri učitavanju recepta', error)
                setRecept(null)
            }
        }

        ucitajRecept()
    }, [id])


    function prilagodiKolicinu(sastojak) {
        // Stari format: "200 g brašna"
        if (typeof sastojak === 'string') {
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
        // Novi format: objekt sa sastojakId, kolicina i jedinica
        if (sastojak && typeof sastojak === 'object') {
            const kolicina = Number(sastojak.kolicina)

            const novaKolicina = Number.isFinite(kolicina)
                ? kolicina * porcije / 2
                : 0
            const prikazKolicine = Number(
                novaKolicina.toFixed(2)
            ).toLocaleString("hr-HR")

            const podatakSastojka = sviSastojci.find(
                (item) => item.id === Number(sastojak.sastojakId)
            )
            const nazivSastojka = sastojak.naziv || 
            sastojak.sastojak?.naziv || podatakSastojka?.naziv ||
            "Sastojak nije pronađen"

            const jedinica = sastojak.jedinica || ""
            return `${prikazKolicine} ${jedinica} ${nazivSastojka}`.trim()
        }
        return ""
    }
    // if (!recept || !recept.id) {
    //     return (
    //         <p className="container mt-4">Recept nije pronađen</p>
    //     )
    // }
    // const sastojci = Array.isArray(recept.sastojci)
    //     ? recept.sastojci : recept.sastojci
    //         ? recept.sastojci.split(',').map(s => s.trim()) : []

    return (
        <div className="container mt-4 mb-5">
            <div className="row align-items-center g-4 mb-4">
                <div className="col-12 col-md-6">
                    <img
                        className="img-fluid rounded-4 shadow"
                        src={slikeRecepata[recept.naziv] || recept.slikaPutanja || recept.slika}
                        // src={recept.slikaPutanja || recept.slika} alt={recept.naziv}
                        style={{
                            width: '100%',
                            height: '350px',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center gap-3">
                        <h2 className="mb-0">{recept.naziv}</h2>

                        <Button variant="link"
                            onClick={promjeniOmiljen}
                            className="p-0 border-0"
                            style={{
                                fontSize: '32px',
                                color: recept.omiljen ? "#dc3545" : "#adb5bd",
                                textDecoration: 'none',
                                lineHeight: 1
                            }}
                            title={recept.omiljen
                                ? 'Ukloni iz omiljenih'
                                : 'Dodaj u omiljene'}
                            aria-label={recept.omiljen
                                ? 'Ukloni iz omiljenih'
                                : 'Dodaj u omiljene'}
                        >
                            {recept.omiljen ? "♥" : "♡"}
                        </Button>
                    </div>
                    <p><strong>Kategorija:</strong>{recept.kategorija}</p>
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
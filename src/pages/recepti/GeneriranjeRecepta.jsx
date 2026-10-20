import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generirajRecept } from "../../services/recepti/GeneriranjeRecepta";
import ReceptService from "../../services/recepti/ReceptService";
import { Alert, Button, Card } from "react-bootstrap";
import { RouteNames } from "../../constants";


export default function GeneriranjeRecepta() {
    const navigate = useNavigate()
    const [poruka, setPoruka] = useState('')
    const [greska, setGreska] = useState(false)
    const [brojRecepata, setBrojRecepata] = useState(3)

    async function kreirajRecept() {
        try {
            for (let i = 0; i < brojRecepata; i++) {
                const noviRecept = generirajRecept()
                await ReceptService.dodaj(noviRecept)
            }
            setGreska(false)
            setPoruka(`Uspješno je generirano ${brojRecepata} recepata!`)
        } catch (error) {
            console.error('Greška pri generiranju recepata:', error)
            setGreska(true)
            setPoruka(`Došlo je do greške pri generiranju recepata`)
        }
    }
    return (
        <div className="container py-4">
            <h2>Generiranje recepta</h2>
            <Card className="mt-3 p-4">
                <p>Generirajte recepte sa slučajnim nazivom,
                    kategorijom, vremenom pripreme i sastojcima
                </p>
                <div className="mb-3">
                    <label htmlFor="brojRecepata" className="form-label">
                        Koliko recepata želite generirati?
                    </label>
                    <select id="brojRecepata"
                        className="form-select"
                        value={brojRecepata}
                        onChange={(e) => setBrojRecepata(Number(e.target.value))}>
                        <option value={1}>1 recept</option>
                        <option value={3}>3 recepta</option>
                        <option value={5}>5 recepata</option>
                        <option value={7}>7 recepata</option>
                    </select>
                </div>
                <div>
                    <Button onClick={kreirajRecept}>
                        🎲 Generiraj recept
                    </Button>
                </div>
                {poruka && (<Alert variant={greska ? 'danger' : 'success'}
                    className="mt-3 mb-0">{poruka}</Alert>
                )}
                <div className="mt-3">
                    <Button variant="outline-secondary"
                        onClick={() => navigate(RouteNames.RECEPTI)}>
                        Pogledaj recepte
                    </Button>
                </div>
            </Card>
        </div>
    )
}
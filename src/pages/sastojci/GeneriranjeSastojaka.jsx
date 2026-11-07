
import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SastojakService from "../../services/sastojci/SastojakService";

const nazivSastojaka = [
    'Batat',
    'Brokula',
    'Češnjak',
    'Cvjetača',
    'Gljive',
    'Grašak',
    'Grah',
    'Jogurt',
    'Kiselo vrhnje',
    'Kukuruz',
    'Limun',
    'Med',
    'Naranča',
    'Orah',
    'Peršin',
    'Rajčica',
    'Riža',
    'Ružmarin',
    'Sir',
    'Špinat',
    'Tuna',
    'Vanilija',
    'Vlasac',
    'Zobene pahuljice',
    'Bademi',
    'Avokado',
    'Kokosovo mlijeko',
    'Losos',
    'Patlidžan',
    'Šampinjoni'
];

export default function GeneriranjeSastojaka() {
    const navigate = useNavigate();

    const [kolicina, setKolicina] = useState('5');
    const [poruka, setPoruka] = useState("");
    const [greska, setGreska] = useState(false);
    const [ucitavanje, setUcitavanje] = useState(false);

    async function generirajSastojke() {
        const broj = Number(kolicina);

        if (!Number.isInteger(broj) || broj < 1 || broj > 1000) {
            setGreska(true);
            setPoruka("Unesi broj između 1 i 1000.");
            return;
        }

        setUcitavanje(true);
        setPoruka("");
        setGreska(false);

        try {
            const odgovor = await SastojakService.get();
            const postojece = odgovor.data || [];

            const nazivi = new Set(
                postojece.map(s => s.naziv.trim().toLowerCase())
            );

            let dodano = 0;

            for (let i = 0; i < broj; i++) {
                const osnovniNaziv =
                    nazivSastojaka[i % nazivSastojaka.length];

                let naziv = osnovniNaziv;
                let sufiks = 2;

                // Traži slobodan, jedinstven naziv
                while (nazivi.has(naziv.toLowerCase())) {
                    naziv = `${osnovniNaziv} ${sufiks}`;
                    sufiks++;
                }

                const sastojak = {
                    naziv,
                    generirano: true
                }
                await SastojakService.dodaj(sastojak)
                nazivi.add(naziv.toLowerCase())
                dodano++;
            }

            setPoruka(
                `Uspješno generirano testnih sastojaka: ${dodano}.`
            )

        } catch (error) {
            console.error("Greška pri generiranju sastojaka:", error)
            setGreska(true)
            setPoruka(
                `Generiranje sastojaka nije uspjelo: ${error.message || error}`
            )
        } finally {
            setUcitavanje(false)
        }
    }

    async function obrisiTestneSastojke() {
        const potvrda = window.confirm(
            "Želiš li obrisati sve generirane testne sastojke?"
        )

        if (!potvrda) return

        setUcitavanje(true)
        setPoruka("")
        setGreska(false)

        try {
            const odgovor = await SastojakService.get()

            const generirani = (odgovor.data || []).filter(
                sastojak => sastojak.generirano === true
            )
            for (const sastojak of generirani) {
                await SastojakService.obrisi(sastojak.id)
            }

            const provjera = await SastojakService.get()
            const preostali = (provjera.data || []).filter(
                sastojak => sastojak.generirano === true
            )
            if (preostali.length > 0) {
                throw new Error(
                    `Preostalo je ${preostali.length} generiranih sastojaka`
                )
            }
            setPoruka(
                `Obrisano generiranih sastojaka: ${generirani.length}.`
            )
        } catch (error) {
            console.error("Greška pri brisanju sastojaka:", error)
            setGreska(true)
            setPoruka(
                `Brisanje nije uspjelo: ${error.message || String(error)}`
            )
        } finally {
            setUcitavanje(false);
        }
    }
    return (
        <div className="p-3">
            <h4>Generiranje testnih sastojaka</h4>
            <Form.Group className="mb-3" controlId="kolicinaSastojaka">
                <Form.Label>Broj sastojaka za generiranje</Form.Label>
                <Form.Control
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    value={kolicina}
                    onChange={e => setKolicina(e.target.value)}
                />
                <Form.Text muted>
                    Unesi željeni broj od 1 do 1000.
                </Form.Text>
            </Form.Group>

            <div className="d-flex flex-column gap-2">
                <Button
                    variant="success"
                    onClick={generirajSastojke}
                    disabled={ucitavanje}
                >
                    Generiraj sastojke
                </Button>

                <Button
                    variant="outline-success"
                    onClick={() => navigate('/sastojci')}
                    disabled={ucitavanje}
                >
                    Prikaži generirane sastojke
                </Button>

                <Button
                    variant="outline-danger"
                    onClick={obrisiTestneSastojke}
                    disabled={ucitavanje}
                >
                    Obriši sve generirane sastojke
                </Button>
            </div>

            {poruka && (
                <Alert
                    variant={greska ? 'danger' : 'success'}
                    className="mt-3 mb-0"
                >
                    {poruka}
                </Alert>
            )}
        </div>
    )
}

import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService";


const naziviJedinica = [
    'g',
    'dk',
    'kg',
    'l',
    'ml',
    'kom',
    'žlica',
    'žličica',
    'prstohvat',
    'glavica',
    'po ukusu',
    'nekoliko listova',
    'po potrebi'
]

export default function GeneriranjeJedinicaMjere() {
    const navigate = useNavigate();

    const [kolicina, setKolicina] = useState('5');
    const [poruka, setPoruka] = useState("");
    const [greska, setGreska] = useState(false);
    const [ucitavanje, setUcitavanje] = useState(false);

    async function generirajJedinice() {
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
            const odgovor = await JedinicaMjereService.get();
            const postojece = odgovor.data || [];

            const nazivi = new Set(
                postojece.map(j => j.naziv.trim().toLocaleLowerCase("hr"))
            );

            let dodano = 0;

            for (let i = 0; i < broj; i++) {
                const osnovniNaziv =
                    naziviJedinica[i % naziviJedinica.length];

                let naziv = osnovniNaziv;
                let sufiks = 2;

                // Traži slobodan, jedinstven naziv
                while (nazivi.has(naziv.toLocaleLowerCase("hr"))) {
                    naziv = `${osnovniNaziv} ${sufiks}`;
                    sufiks++;
                }

                await JedinicaMjereService.dodaj({
                    naziv,
                    generirano: true
                });

                nazivi.add(naziv.toLocaleLowerCase("hr"));
                dodano++;
            }

            setPoruka(
                `Uspješno generirano testnih jedinica mjere: ${dodano}.`
            );

        } catch (error) {
            console.error("Greška pri generiranju jedinica mjere:", error);
            setGreska(true);
            setPoruka(
                `Generiranje nije uspjelo: ${error.message || error}`
            );
        } finally {
            setUcitavanje(false);
        }
    }

    async function obrisiTestneJedinice() {
        const potvrda = window.confirm(
            "Želiš li obrisati sve generirane testne jedinice mjere?"
        );

        if (!potvrda) return;

        setUcitavanje(true);
        setPoruka("");
        setGreska(false);

        try {
            const odgovor = await JedinicaMjereService.get();

            const generirane = (odgovor.data || []).filter(
                jedinica => jedinica.generirano === true
            );

            for (const jedinica of generirane) {
                await JedinicaMjereService.obrisi(jedinica.id);
            }

            const provjera = await JedinicaMjereService.get();

            const preostale = (provjera.data || []).filter(
                jedinica => jedinica.generirano === true
            );

            if (preostale.length > 0) {
                throw new Error(
                    `Preostalo je ${preostale.length} generiranih jedinica mjere.`
                );
            }

            setPoruka(
                `Obrisano generiranih jedinica mjere: ${generirane.length}.`
            );

        } catch (error) {
            console.error("Greška pri brisanju jedinica mjere:", error);
            setGreska(true);
            setPoruka(
                `Brisanje nije uspjelo: ${error.message || error}`
            );
        } finally {
            setUcitavanje(false);
        }
    }

    return (
        <div className="p-3">
            <h4>Generiranje testnih jedinica mjere</h4>

            <Form.Group className="mb-3" controlId="kolicinaJedinica">
                <Form.Label>Broj jedinica mjere za generiranje</Form.Label>

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
                    onClick={generirajJedinice}
                    disabled={ucitavanje}
                >
                    Generiraj jedinice mjere
                </Button>

                <Button
                    variant="outline-success"
                    onClick={() => navigate('/jediniceMjere')}
                    disabled={ucitavanje}
                >
                    Prikaži generirane jedinice mjere
                </Button>

                <Button
                    variant="outline-danger"
                    onClick={obrisiTestneJedinice}
                    disabled={ucitavanje}
                >
                    Obriši sve generirane jedinice mjere
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
    );
}
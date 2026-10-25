
import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import KategorijaService from "../../services/kategorije/KategorijaService";
import { kategorije } from "../../services/kategorije/KategorijaPodaci";
import { tr } from "@faker-js/faker";


const nazivKategorija = [
    'Juhe',
    'Salate',
    'Tjestenine',
    'Riba',
    'Mesna jela',
    'Prilozi',
    'Umaci',
    'Deserti',
    'Peciva',
    'Vegetarijanska jela',
    'Veganska jela',
    'Smoothie',
    'Sendviči',
    'Variva',
    'Grickalice'
]

export default function GeneriranjeRecepata() {
    const navigate = useNavigate()

    const [kolicina, setKolicina] = useState('5')
    const [poruka, setPoruka] = useState("")
    const [greska, setGreska] = useState(false)
    const [ucitavanje, setUcitavanje] = useState(false)

    async function generirajKategorije() {
        const broj = Number(kolicina)

        if (!Number.isInteger(broj) || broj < 1 || broj > 1000) {
            setGreska(true)
            setPoruka("Unesi broj između 1 i 1000.")
            return;
        }

        setUcitavanje(true)
        setPoruka("")
        setGreska(false)

        try {
            const odgpvor = await KategorijaService.get()
            const postojece = odgpvor.data || []

            let dodano = 0
            for (let i = 0; i < broj; i++) {
                const naziv = nazivKategorija[
                    i % nazivKategorija.length
                ]
                const kategorija = {
                    naziv: naziv,
                    generirano: true
                }
                await KategorijaService.dodaj(kategorija)
                dodano++;
            }
            setPoruka(`Uspješno testnih kategorija: ${dodano}.`)
        } catch (error) {
            console.error('Greška pri brisanju kategorija:', error)
            setGreska(true)
            setPoruka(`Brisanje nije uspjelo: ${error.message || error}`)
        } finally {
            setUcitavanje(false);
        }
    }

    async function obrisiTestneKategorije() {
        const potvrda = window.confirm(
            "Želiš li obrisati sve generirane testne kategorije?"
        )

        if (!potvrda) return

        setUcitavanje(true)
        setPoruka("");
        setGreska(false)

        try {
            const odgovor = await KategorijaService.get()
            const generirane = (odgovor.data || []).filter(
                kategorija => kategorija.generirano === true
            )

            for (const kategorija of generirane) {
                await KategorijaService.obrisi(kategorija.id);
            }
            const provjera = await KategorijaService.get()
const preostale =(provjera.data || []).filter(
    kategorija => kategorija.generirano === true)

    if (preostale.length > 0) {
        throw new Error(`Preostalo je ${preostale.length} generiranih kategorija`)
    }
            setPoruka(
                `Obrisano generiranih kategorija: ${generirane.length}.`)
        } catch (error) {
            console.error("Greška pri brisanju kategorija:", error)
            setGreska(true)
            setPoruka(`Brisanje nije uspjelo: ${error.message || String(error)}`)
        } finally {
            setUcitavanje(false);
        }
    }

    return (
        <div className="p-3">
            <h4>Generiranje testnih kategorija</h4>

            <Form.Group className="mb-3" controlId="kolicinaKategorija">
                <Form.Label>Broj kategorija za generiranje</Form.Label>
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
                    onClick={generirajKategorije}
                    disabled={ucitavanje}
                >Generiraj kategorije
                </Button>

                <Button
                    variant="outline-success"
                    onClick={() => navigate('/kategorije')}
                    disabled={ucitavanje}
                >Prikaži generirane kategorije
                </Button>

                <Button
                    variant="outline-danger"
                    onClick={obrisiTestneKategorije}
                    disabled={ucitavanje}
                >Obriši sve generirane kategorije
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




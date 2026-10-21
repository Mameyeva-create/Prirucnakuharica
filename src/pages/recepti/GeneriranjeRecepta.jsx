import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReceptService from "../../services/recepti/ReceptService";
import { Alert, Button, Card, Spinner } from "react-bootstrap";
import { RouteNames } from "../../constants";
import { faker } from "@faker-js/faker";

// Pomoćna funkcija za generiranje jednog potpuno nasumičnog recepta pomoću Frakera
function generirajDinamickiRecept() {
    const kategorije = ['Doručak', 'Ručak', 'Večera', 'Deserti', 'Predjelo'];
    const odabranaKategorija = faker.helpers.arrayElement(kategorije);

    // Generiramo nasumične sastojke (od 3 do 7 sastojaka)
    const brojSastojaka = faker.number.int({ min: 3, max: 7 });
    const sastojci = Array.from({ length: brojSastojaka }, () => 
        `${faker.number.int({ min: 50, max: 500 })} g ${faker.food.ingredient()}`
    );

    return {
        id: Date.now() + Math.floor(Math.random() * 10000),
        naziv: faker.food.dish(),
        kategorija: odabranaKategorija,
        vrijeme: faker.number.int({ min: 10, max: 90 }),
        slikaPutanja: `/src/assets/slike/default.jpg`,
        opis: faker.food.description(),
        sastojci: sastojci,
        priprema: `1. Pripremite i očistite sve sastojke.\n2. ${faker.hacker.verb()} ${faker.food.ingredient()} na srednjoj temperaturi.\n3. Dodajte preostale sastojke i ${faker.hacker.verb()} dok ne postignete željenu teksturu.\n4. Poslužite toplo i uživajte u jelu!`,
        omiljen: faker.datatype.boolean(),
        vegansko: faker.datatype.boolean()
    };
}

export default function GeneriranjeRecepta() {
    const navigate = useNavigate();
    const [poruka, setPoruka] = useState('');
    const [greska, setGreska] = useState(false);
    const [brojRecepata, setBrojRecepata] = useState(3);
    const [ucitavaSe, setUcitavaSe] = useState(false);

    async function kreirajRecept() {
        setUcitavaSe(true);
        setPoruka('');
        try {
            for (let i = 0; i < brojRecepata; i++) {
                const noviRecept = generirajDinamickiRecept();
                await ReceptService.dodaj(noviRecept);
            }
            setGreska(false);
            setPoruka(`Uspješno je generirano i spremljeno ${brojRecepata} nasumičnih recepata!`);
        } catch (error) {
            console.error('Greška pri generiranju recepata:', error);
            setGreska(true);
            setPoruka('Došlo je do greške pri spremanju recepata u bazu.');
        } finally {
            setUcitavaSe(false);
        }
    }

    return (
        <div className="container py-4">
            <h2>Generiranje recepta</h2>
            <Card className="mt-3 p-4 shadow-sm">
                <p>
                    Generirajte nasumične recepte pomoću Fakera sa slučajnim nazivom,
                    kategorijom, vremenom pripreme, sastojcima i koracima.
                </p>
                <div className="mb-3">
                    <label htmlFor="brojRecepata" className="form-label">
                        Koliko recepata želite generirati?
                    </label>
                    
                    <input 
                        id="brojRecepata"
                        className="form-text"
                        value={brojRecepata}
                        disabled={ucitavaSe}
                        onChange={(e) => setBrojRecepata(Number(e.target.value))} />
              
                   
                </div>
                <div>
                    <Button onClick={kreirajRecept} disabled={ucitavaSe}>
                        {ucitavaSe ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Generiranje...
                            </>
                        ) : (
                            '🎲 Generiraj recept'
                        )}
                    </Button>
                </div>
                {poruka && (
                    <Alert variant={greska ? 'danger' : 'success'} className="mt-3 mb-0">
                        {poruka}
                    </Alert>
                )}
                <div className="mt-3">
                    <Button 
                        variant="outline-secondary"
                        onClick={() => navigate(RouteNames.RECEPTI)}>
                        Pogledaj recepte
                    </Button>
                </div>
            </Card>
        </div>
    );
}
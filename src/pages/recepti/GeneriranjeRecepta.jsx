
import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Faker, hr } from "@faker-js/faker";
import ReceptService from "../../services/recepti/ReceptService";
import KategorijaService from "../../services/kategorije/KategorijaService";
import SastojakService from "../../services/sastojci/SastojakService";
import carbonara from "../../assets/slike/carbonara.jpg";
import cezarSalata from "../../assets/slike/cezar-salata.jpg";
import cokoladniKolac from "../../assets/slike/cokoladni-kolac.jpg";
import palacinke from "../../assets/slike/palacinke.jpg";
import piletina from "../../assets/slike/piletina.jpg";
import pizza from "../../assets/slike/pizza.jpg";
import povrtnaJuha from "../../assets/slike/povrtna-juha.jpg";
import { useNavigate } from "react-router-dom";

const faker = new Faker({ locale: [hr] });

const predlosci = [
    {
        naziv: "Tjestenina Carbonara",
        kategorija: "Ručak",
        vrijeme: 20,
        slika: carbonara,
        slikaPutanja: "/src/assets/slike/carbonara.jpg",
        opis: "Jednostavna tjestenina s jajima, sirom i pancetom.",
        sastojci: [
            ["Tjestenina", 200, "g"],
            ["Panceta", 100, "g"],
            ["Jaja", 2, "kom"],
            ["Parmezan", 50, "g"],
            ["Sol", 1, "žličica"],
            ["Papar", 1, "žličica"]
        ],
        priprema:
            "1. Skuhajte tjesteninu.\n" +
            "2. Popržite pancetu.\n" +
            "3. Umutite jaja i parmezan.\n" +
            "4. Pomiješajte sve sastojke.\n" +
            "5. Poslužite odmah.",
        vegansko: false
    },
    {
        naziv: "Palačinke",
        kategorija: "Doručak",
        vrijeme: 15,
        slika: palacinke,
        slikaPutanja: "/src/assets/slike/palacinke.jpg",
        opis: "Brze palačinke koje možete poslužiti sa slatkim nadjevom.",
        sastojci: [
            ["Brašno", 200, "g"],
            ["Mlijeko", 300, "ml"],
            ["Jaja", 2, "kom"],
            ["Šećer", 1, "žlica"],
            ["Ulje", 1, "žlica"],
            ["Sol", 1, "žličica"]
        ],
        priprema:
            "1. Pomiješajte brašno, mlijeko i jaja.\n" +
            "2. Dodajte šećer i sol.\n" +
            "3. Zagrijte i nauljite tavu.\n" +
            "4. Pecite palačinke s obje strane.\n" +
            "5. Poslužite s omiljenim nadjevom.",
        vegansko: false
    },
    {
        naziv: "Piletina s povrćem",
        kategorija: "Ručak",
        vrijeme: 35,
        slika: piletina,
        slikaPutanja: "/src/assets/slike/piletina.jpg",
        opis: "Ukusan obrok s piletinom i svježim povrćem.",
        sastojci: [
            ["Pileća prsa", 400, "g"],
            ["Mrkva", 2, "kom"],
            ["Krumpir", 3, "kom"],
            ["Paprika", 1, "kom"],
            ["Luk", 1, "kom"],
            ["Ulje", 2, "žlica"],
            ["Sol", 1, "žličica"],
            ["Papar", 1, "žličica"]
        ],
        priprema:
            "1. Narežite piletinu i povrće.\n" +
            "2. Začinite solju i paprom.\n" +
            "3. Dodajte ulje.\n" +
            "4. Pecite na 200 °C oko 25–30 minuta.\n" +
            "5. Poslužite toplo.",
        vegansko: false
    },
    {
        naziv: "Pizza Margherita",
        kategorija: "Večera",
        vrijeme: 30,
        slika: pizza,
        slikaPutanja: "/src/assets/slike/pizza.jpg",
        opis: "Klasična pizza s rajčicom, mozzarellom i bosiljkom.",
        sastojci: [
            ["Tijesto za pizzu", 300, "g"],
            ["Umak od rajčice", 150, "g"],
            ["Mozzarella", 200, "g"],
            ["Svježi bosiljak", 5, "g"],
            ["Ulje", 1, "žlica"]
        ],
        priprema:
            "1. Razvaljajte tijesto.\n" +
            "2. Premažite ga umakom od rajčice.\n" +
            "3. Dodajte mozzarellu.\n" +
            "4. Pecite na 220 °C oko 10–15 minuta.\n" +
            "5. Dodajte bosiljak i poslužite.",
        vegansko: false
    },
    {
        naziv: "Cezar salata",
        kategorija: "Ručak",
        vrijeme: 20,
        slika: cezarSalata,
        slikaPutanja: "/src/assets/slike/cezar-salata.jpg",
        opis: "Svježa salata s piletinom, krutonima i Cezar umakom.",
        sastojci: [
            ["Pileća prsa", 300, "g"],
            ["Zelena salata", 1, "kom"],
            ["Krutoni", 80, "g"],
            ["Parmezan", 40, "g"],
            ["Cezar umak", 3, "žlica"]
        ],
        priprema:
            "1. Operite i narežite salatu.\n" +
            "2. Ispecite piletinu.\n" +
            "3. Narežite piletinu na komade.\n" +
            "4. Pomiješajte salatu, piletinu i krutone.\n" +
            "5. Dodajte umak i parmezan.",
        vegansko: false
    },
    {
        naziv: "Čokoladni kolač",
        kategorija: "Desert",
        vrijeme: 45,
        slika: cokoladniKolac,
        slikaPutanja: "/src/assets/slike/cokoladni-kolac.jpg",
        opis: "Sočan čokoladni kolač bogatog okusa.",
        sastojci: [
            ["Čokolada za kuhanje", 200, "g"],
            ["Brašno", 150, "g"],
            ["Šećer", 120, "g"],
            ["Jaja", 3, "kom"],
            ["Maslac", 100, "g"],
            ["Prašak za pecivo", 1, "žličica"]
        ],
        priprema:
            "1. Zagrijte pećnicu na 180 °C.\n" +
            "2. Otopite čokoladu i maslac.\n" +
            "3. Umutite jaja i šećer.\n" +
            "4. Dodajte čokoladu, brašno i prašak za pecivo.\n" +
            "5. Pecite oko 25–30 minuta.",
        vegansko: false
    },
    {
        naziv: "Povrtna juha",
        kategorija: "Ručak",
        vrijeme: 25,
        slika: povrtnaJuha,
        slikaPutanja: "/src/assets/slike/povrtna-juha.jpg",
        opis: "Lagana juha od svježeg povrća.",
        sastojci: [
            ["Mrkva", 2, "kom"],
            ["Krumpir", 3, "kom"],
            ["Luk", 1, "kom"],
            ["Tikvica", 1, "kom"],
            ["Povrtni temeljac", 1200, "ml"],
            ["Ulje", 1, "žlica"],
            ["Sol", 1, "žličica"],
            ["Papar", 1, "žličica"]
        ],
        priprema:
            "1. Operite i narežite povrće.\n" +
            "2. Nasjeckajte luk i kratko ga popržite.\n" +
            "3. Dodajte povrće i temeljac.\n" +
            "4. Kuhajte oko 20 minuta.\n" +
            "5. Začinite i poslužite toplo.",
        vegansko: true
    }
];

export default function GeneriranjeRecepata() {
    const navigate = useNavigate()
    const [kolicina, setKolicina] = useState(10)
    const [poruka, setPoruka] = useState("")
    const [greska, setGreska] = useState(false)
    const [ucitavanje, setUcitavanje] = useState(false)

    async function generirajRecepte() {
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
            const [odgovorKategorije, odgovorSastojaka] =
                await Promise.all([
                    KategorijaService.get(),
                    SastojakService.get()
                ]);

            const kategorije = odgovorKategorije.data
            const sastojci = odgovorSastojaka.data

            if (!kategorije?.length || !sastojci?.length) {
                throw new Error("Nema kategorija ili sastojaka.");
            }
            const dostupniPredlosci = predlosci.map(predlozak => {
                const kategorija = kategorije.find(k => normalizirajNaziv(k.naziv) ===
                    normalizirajNaziv(predlozak.kategorija)) || kategorije[0]

                const stavke = predlozak.sastojci
                    .map(([naziv, kolicina, jedinica]) => {
                        const sastojak = sastojci.find(
                            s => s && normalizirajNaziv(s.naziv) === normalizirajNaziv(naziv)
                        );

                        if (!sastojak) return null;

                        return {
                            sastojak: sastojak.id,
                            kolicina,
                            jedMjere: jedinica
                        };
                    })
                    .filter(Boolean);
                return { predlozak, kategorija, stavke }
            })
                .filter(item => item.stavke.length > 0)
            if (!dostupniPredlosci.length) {
                throw new Error("Nijedan predložak nema sastojke koji postoje u bazi")
            }
            let dodano = 0
            for (let i = 0; i < broj; i++) {
                const odabrani = faker.helpers.arrayElement(dostupniPredlosci)

                const { predlozak, kategorija, stavke } = odabrani

                const recept = {
                    naziv: predlozak.naziv,
                    kategorija: kategorija.naziv,
                    vrijeme: predlozak.vrijeme,
                    slika: predlozak.slika,
                    slikaPutanja: predlozak.slikaPutanja,
                    opis: predlozak.opis,
                    priprema: predlozak.priprema,
                    osnovnePorcije: 2,
                    sastojci: stavke,
                    omiljen: faker.datatype.boolean(),
                    vegansko: predlozak.vegansko,
                    generirano: true
                };

                await ReceptService.dodaj(recept);
                dodano++;
            }
            setPoruka(`Uspješno dodano recepata: ${dodano}.`);
        } catch (error) {
            console.error("Greška pri generiranju recepata:", error);
            setGreska(true);
            setPoruka(error.message || "Generiranje nije uspjelo. Provjeri konzolu");
        } finally {
            setUcitavanje(false);
        }
    }

    async function obrisiGeneriraneRecepte() {
        const potvrda = window.confirm(
            "Želiš li obrisati sve recepte koje je stvorio generator?"
        );

        if (!potvrda) return;

        setUcitavanje(true);
        setPoruka("");
        setGreska(false);

        try {
            const odgovor = await ReceptService.get();
            const generirani = odgovor.data.filter(
                recept => recept.generirano === true
            );

            for (const recept of generirani) {
                await ReceptService.obrisi(recept.id);
            }

            setPoruka(
                `Obrisano generiranih recepata: ${generirani.length}.`
            );
        } catch (error) {
            console.error("Greška pri brisanju recepata:", error);
            setGreska(true);
            setPoruka("Brisanje nije uspjelo. Provjeri konzolu.");
        } finally {
            setUcitavanje(false);
        }
    }

    return (
        <div className="p-3">
            <h4>Generiranje testnih recepata</h4>

            <Form.Group className="mb-3" controlId="kolicina">
                <Form.Label>Broj recepata za generiranje</Form.Label>
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
                    onClick={generirajRecepte}
                    disabled={ucitavanje}
                >Generiraj recepte
                </Button>

                <Button
                    variant="outline-success"
                    onClick={() => navigate('/recepti?generirani=true')}
                >Prikaži generirane recepte
                </Button>
                <Button
                    variant="outline-danger"
                    onClick={obrisiGeneriraneRecepte}
                    disabled={ucitavanje}
                > Obriši sve generirane recepte
                </Button>
            </div>

            {poruka && (
                <Alert
                    variant={greska ? 'danger' : 'success'}
                    className="mt-3 py-2"
                >
                    {poruka}
                </Alert>
            )}
        </div>
    );
}


function normalizirajNaziv(naziv) {
    if (typeof naziv !== 'string') {
        return ''
    }
    return naziv
        .toLocaleLowerCase('hr')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}


import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import ReceptService from "../../services/recepti/ReceptService";
import KategorijaService from "../../services/kategorije/KategorijaService";
import SastojakService from "../../services/sastojci/SastojakService";
import { useNavigate } from "react-router-dom";
import JedinicaMjereService from "../../services/jedinicaMjere/JedinicaMjereService";



const predlosci = [
    {
        naziv: "Tjestenina Carbonara",
        kategorija: "Ručak",
        vrijeme: 20,
        slikaPutanja: "/slike/carbonara.jpg",
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
        slikaPutanja: "/slike/palacinke.jpg",
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
        slikaPutanja: "/slike/piletina.jpg",
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
        slikaPutanja: "/slike/pizza.jpg",
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
        slikaPutanja: "/slike/cezar-salata.jpg",
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
        slikaPutanja: "/slike/cokoladni-kolac.jpg",
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
        slikaPutanja: "/slike/povrtna-juha.jpg",
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
]
// Normalizacija naziva radi izbjegavanja duplikata
function normalizirajNaziv(naziv) {
    return naziv
        .toLocaleLowerCase("hr")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
}
// Generiranje jedinstvenog naziva
function generirajJedinstveniNaziv(osnovniNaziv, zauzetiNazivi) {
    let naziv = osnovniNaziv
    let broj = 2
    while (zauzetiNazivi.has(normalizirajNaziv(naziv))) {
        naziv = `${osnovniNaziv} (${broj})`
        broj++
    }
    zauzetiNazivi.add(normalizirajNaziv(naziv))
    return naziv
}

export default function GeneriranjeRecepata() {
    const navigate = useNavigate()
    const [kolicina, setKolicina] = useState("10")
    const [poruka, setPoruka] = useState("")
    const [greska, setGreska] = useState(false)
    const [ucitavanje, setUcitavanje] = useState(false)

    // Dohvaćanje svih podataka
    async function dohvatiPodatke() {
        const [
            odgovorRecepti,
            odgovorKategorije,
            odgovorSastojci,
            odgovorJedinice
        ] = await Promise.all([
            ReceptService.get(),
            KategorijaService.get(),
            SastojakService.get(),
            JedinicaMjereService.get()
        ])
        return {
            recepti: odgovorRecepti.data || [],
            kategorije: odgovorKategorije.data || [],
            sastojci: odgovorSastojci.data || [],
            jedinice: odgovorJedinice.data || []
        }
    }

    // Pronalaženje ili automatsko dodavanje sastojka
    async function osigurajSastojak(naziv, sastojci) {
        let sastojak = sastojci.find(s => normalizirajNaziv(s.naziv) === normalizirajNaziv(naziv))
        if (sastojak) {
            return sastojak
        }
        await SastojakService.dodaj({
            naziv,
            generirano: true
        })
        const odgovor = await SastojakService.get()
        sastojci.splice(0, sastojci.length, ...(odgovor.data || []))
        sastojak = sastojci.find(
            s => normalizirajNaziv(s.naziv) === normalizirajNaziv(naziv)
        )
        if (!sastojak || !Number.isInteger(Number(sastojak.id))) {
            throw new Error(`Sastojak "${naziv}" nije uspješno dodan`)
        }
        return sastojak
    }
    // Pronalaženje ili automatsko dodavanje jedinice mjere
    async function osigurajJedinicu(naziv, jedinice) {
        let jedinica = jedinice.find(
            j => normalizirajNaziv(j.naziv) === normalizirajNaziv(naziv)
        )
        if (jedinica) {
            return jedinica
        }
        await JedinicaMjereService.dodaj({
            naziv,
            generirano: true
        })
        const odgovor = await JedinicaMjereService.get()
        jedinice.splice(0, jedinice.length, ...(odgovor.data || []))
        jedinica = jedinice.find(
            j => normalizirajNaziv(j.naziv) === normalizirajNaziv(naziv)
        )
        if (!jedinica || !Number.isInteger(Number(jedinica.id))) {
            throw new Error(`Jedinica mjere "${naziv}" nije uspješno dodana`)
        }
        return jedinica
    }
        // Pronalaženje ili automatsko dodavanje kategorije
    async function osigurajKategoriju(naziv, kategorije) {
        let kategorija = kategorije.find(
            k => normalizirajNaziv(k.naziv) === normalizirajNaziv(naziv)
        )
        if (kategorija) {
            return kategorija;
        }
        await KategorijaService.dodaj({
            naziv,
            generirano: true
        })
        const odgovor = await KategorijaService.get();
        kategorije.splice(0, kategorije.length, ...(odgovor.data || []))
        kategorija = kategorije.find(
            k => normalizirajNaziv(k.naziv) === normalizirajNaziv(naziv)
        )
        if (!kategorija || !Number.isInteger(Number(kategorija.id))) {
            throw new Error(`Kategorija "${naziv}" nije uspješno dodana`)
        }
        return kategorija
    }
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

        let dodano = 0

        try {
            const podaci = await dohvatiPodatke()
            if (!podaci.kategorije.length) {
                throw new Error("Nema dostupnih kategorija")
            }
            const zauzetiNazivi = new Set(podaci.recepti.map(recept =>
                normalizirajNaziv(recept.naziv)
            ))
            for (let i = 0; i < broj; i++) {
                const predlozak = predlosci[i % predlosci.length]
                const kategorija = await osigurajKategoriju(predlozak.kategorija,
                    podaci.kategorije
                )
                const sastojci = []
                for (const [
                    nazivSastojka,
                    kolicinaSastojka,
                    nazivJedinice
                ] of predlozak.sastojci) {

                    const sastojak = await osigurajSastojak(
                        nazivSastojka, podaci.sastojci)
                    const jedinica = await osigurajJedinicu(
                        nazivJedinice, podaci.jedinice)
                    const factor = 0.9 + Math.random() * 0.2
                    const novaKolicina = Math.max(1, Math.round(kolicinaSastojka * factor))
                    sastojci.push({
                        sastojak: Number(sastojak.id),
                        kolicina: novaKolicina,
                        jedMjere: Number(jedinica.id)
                    })
                }
                const noviRecept = {
                    naziv: generirajJedinstveniNaziv(predlozak.naziv, zauzetiNazivi),
                    kategorija: kategorija.id,
                    vrijeme: predlozak.vrijeme,
                    slikaPutanja: predlozak.slikaPutanja,
                    opis: predlozak.opis,
                    sastojci,
                    priprema: predlozak.priprema,
                    omiljen: false,
                    vegansko: predlozak.vegansko,
                    generirano: true
                }
                await ReceptService.dodaj(noviRecept)
                dodano++
            }
            setPoruka(`Uspješno generirano testnih recepata: ${dodano}.`)
        } catch (error) {
            console.error("Greška pri generiranju recepata:", error)
            setGreska(true);
            setPoruka(`Generiranje nije u potpunosti uspjelo. Dodano recepata: ${dodano}. ${error.message || error}`)
        } finally {
            setUcitavanje(false)
        }
    }
    async function obrisiGeneriraneRecepte() {
        const potvrda = window.confirm(
            "Želiš li obrisati sve recepte koje je stvorio generator?"
        )
        if (!potvrda) return;
        setUcitavanje(true);
        setPoruka("");
        setGreska(false);
        try {
            const odgovor = await ReceptService.get()
            const generirani = (odgovor.data || []).filter(
                recept => recept.generirano === true
            )

            for (const recept of generirani) {
                await ReceptService.obrisi(recept.id);
            }
            // Provjera brisanja recepata
            const provjera = await ReceptService.get()
            const preostaliRecepti = (provjera.data || []).filter(
                recept => recept.generirano === true
            )
            if (preostaliRecepti.length > 0) {
                throw new Error(`Preostalo je ${preostaliRecepti.length} generiranih recepata`)
            }
            // Dohvaćanje preostalih recepata i podataka
            const [
                odgovorSastojci,
                odgovorJedinice
            ] = await Promise.all([
                SastojakService.get(),
                JedinicaMjereService.get()
            ])
            const sastojci = odgovorSastojci.data || []
            const jedinice = odgovorJedinice.data || []

            // Dohvaćanje preostalih recepata i podataka
            const koristeniSastojci = new Set()
            const koristeneJedinice = new Set()
            for (const recept of provjera.data || []) {
                for (const stavka of recept.sastojci || []) {
                    if (stavka.sastojak != null) {
                        koristeniSastojci.add(Number(stavka.sastojak))
                    }
                    if (stavka.jedMjere != null) {
                        koristeneJedinice.add(Number(stavka.jedMjere))
                    }
                }
            }
            // Brisanje samo generiranih sastojaka koji se ne koriste
            const zaBrisanjeSastojci = sastojci.filter(sastojak =>
                sastojak.generirano === true &&
                !koristeniSastojci.has(Number(sastojak.id))
            )
            for (const sastojak of zaBrisanjeSastojci) {
                await SastojakService.obrisi(sastojak.id)
            }
            // Brisanje samo generiranih jedinica koje se ne koriste
            const zaBrisanjeJedinice = jedinice.filter(jedinica =>
                jedinica.generirano === true &&
                !koristeneJedinice.has(Number(jedinica.id))
            )
            for (const jedinica of zaBrisanjeJedinice) {
                await JedinicaMjereService.obrisi(jedinica.id)
            }
            // Završna provjera brisanja sastojaka i jedinica
            const [
                provjeraSastojci,
                provjeraJedinice
            ] = await Promise.all([
                SastojakService.get(),
                JedinicaMjereService.get()
            ])
            const preostaliSastojci = (provjeraSastojci.data || []).filter(
                sastojak => zaBrisanjeSastojci.some(
                    obrisani => obrisani.id === sastojak.id
                ))
            const preostaleJedinice = (provjeraJedinice.data || []).filter(
                jedinica => zaBrisanjeJedinice.some(
                    obrisana => obrisana.id === jedinica.id
                ))
            if (preostaliSastojci.length || preostaleJedinice.length) {
                throw new Error("Neki generirani sastojci ili jedinice nisu obrisani")
            }

            setPoruka(
                `Obrisano recepata: ${generirani.length}. ` +
                `Obrisano nekorištenih generiranih sastojaka: ${zaBrisanjeSastojci.length}. ` +
                `Obrisano nekorištenih generiranih jedinica mjere: ${zaBrisanjeJedinice.length}.`
            )
        } catch (error) {
            console.error("Greška pri brisanju generiranih podataka:", error)
            setGreska(true);
            setPoruka(`Brisanje nije uspjelo: ${error.message || error}`)
        } finally {
            setUcitavanje(false)
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
                    disabled={ucitavanje}
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
    )
}



import { faker } from "@faker-js/faker";
import SastojakService from "../services/sastojci/SastojakService";
import JedinicaMjereService from "../services/jedinicaMjere/JedinicaMjereService";
import KategorijaService from "../services/kategorije/KategorijaService";


const recepti = {
    "Tjestenina": {
        sastojci: ["Tjestenina", "Panceta", "Jaja", "Parmezan", "Ulje", "Sol", "Papar"],
        kategorija: "Ručak"
    },
    "Povrtna juha": {
        sastojci: ["Mrkva", "Krumpir", "Paprika", "Luk", "Povrtni temeljac", "Sol", "Papar"],
        kategorija: "Ručak"
    },
    "Salata": {
        sastojci: ["Zelena salata", "Krutoni", "Cezar umak", "Mrkva", "Ulje", "Sol"],
        kategorija: "Večera"
    },
    "Rižoto": {
        sastojci: ["Luk", "Mrkva", "Povrtni temeljac", "Sol", "Papar", "Ulje"],
        kategorija: "Ručak"
    },
    "Palačinke": {
        sastojci: ["Jaja", "Brašno", "Mlijeko", "Šećer", "Ulje"],
        kategorija: "Desert"
    },
    "Pečeno povrće": {
        sastojci: ["Mrkva", "Krumpir", "Paprika", "Luk", "Tikvica", "Ulje", "Sol"],
        kategorija: "Ručak"
    },
    "Čokoladni kolač": {
        sastojci: ["Jaja", "Brašno", "Šećer", "Čokolada za kuhanje", "Maslac", "Prašak za pecivo", "Mlijeko"],
        kategorija: "Desert"
    }
};


// Količine i mjerne jedinice prema nazivu sastojka
const pravilaSastojaka = {
    "Tjestenina": { min: 80, max: 150, mjera: "g" },
    "Panceta": { min: 30, max: 80, mjera: "g" },
    "Jaja": { min: 1, max: 3, mjera: "kom" },
    "Parmezan": { min: 20, max: 50, mjera: "g" },
    "Brašno": { min: 100, max: 250, mjera: "g" },
    "Mlijeko": { min: 100, max: 250, mjera: "ml" },
    "Šećer": { min: 10, max: 50, mjera: "g" },
    "Ulje": { min: 5, max: 20, mjera: "ml" },
    "Sol": { min: 1, max: 5, mjera: "g" },
    "Papar": { min: 1, max: 3, mjera: "g" },
    "Mrkva": { min: 50, max: 150, mjera: "g" },
    "Krumpir": { min: 100, max: 200, mjera: "g" },
    "Paprika": { min: 50, max: 150, mjera: "g" },
    "Luk": { min: 30, max: 100, mjera: "g" },
    "Tijesto za pizzu": { min: 200, max: 300, mjera: "g" },
    "Umak od rajčice": { min: 50, max: 100, mjera: "g" },
    "Mozzarella": { min: 50, max: 100, mjera: "g" },
    "Svježi bosiljak": { min: 5, max: 15, mjera: "g" },
    "Zelena salata": { min: 50, max: 100, mjera: "g" },
    "Krutoni": { min: 20, max: 50, mjera: "g" },
    "Cezar umak": { min: 20, max: 50, mjera: "g" },
    "Čokolada za kuhanje": { min: 30, max: 100, mjera: "g" },
    "Maslac": { min: 20, max: 80, mjera: "g" },
    "Prašak za pecivo": { min: 5, max: 15, mjera: "g" },
    "Tikvica": { min: 100, max: 200, mjera: "g" },
    "Povrtni temeljac": { min: 100, max: 250, mjera: "ml" }
}


const opisiRecepata = [
    "Jednostavan recept za ukusan obrok.",
    "Ukusno jelo koje se lako priprema.",
    "Odličan izbor za svakodnevni ručak.",
    "Brz i praktičan recept za cijelu obitelj.",
    "Ukusna kombinacija sastojaka za svaki dan."
]


export async function generirajRecept() {

    // Dohvati podatke iz aktivnih servisa
    const [rezultatSastojci, rezultatJedinice, rezultatKategorije] =
        await Promise.all([
            SastojakService.get(),
            JedinicaMjereService.get(),
            KategorijaService.get()
        ])

    const sastojci = rezultatSastojci.data;
    const jedinice = rezultatJedinice.data;
    const kategorije = rezultatKategorije.data;

    if (sastojci.length === 0) {
        throw new Error("Nema dostupnih sastojaka.");
    }

    if (jedinice.length === 0) {
        throw new Error("Nema dostupnih mjernih jedinica.");
    }

    if (kategorije.length === 0) {
        throw new Error("Nema dostupnih kategorija.");
    }

    // Odaberi nasumični recept
    const naziv = faker.helpers.arrayElement(Object.keys(recepti));
    const recept = recepti[naziv];

    // Pronađi sastojke koji postoje u LocalStorageu
    const moguciSastojci = recept.sastojci
        .map(nazivSastojka =>
            sastojci.find(s =>
                s.naziv.trim().toLowerCase() === nazivSastojka.toLowerCase()
            )
        )
        .filter(Boolean);

    if (moguciSastojci.length < 3) {
        throw new Error(`Nema dovoljno sastojaka za recept: ${naziv}.`);
    }

    // Odaberi 3 do 6 različitih sastojaka
    const odabraniSastojci = faker.helpers.arrayElements(
        moguciSastojci,
        Math.min(faker.number.int({ min: 3, max: 6 }), moguciSastojci.length)
    );

    // Pronađi stvarnu kategoriju
    const kategorija = kategorije.find(k =>
        k.naziv.toLowerCase() === recept.kategorija.toLowerCase()
    );

    if (!kategorija) {
        throw new Error(`Kategorija ${recept.kategorija} ne postoji.`);
    }

    return {
        naziv,
        kategorija: kategorija.naziv,
        vrijeme: faker.number.int({ min: 10, max: 60 }),
        slika: null,
        slikaPutanja: "",
        opis: faker.helpers.arrayElement(opisiRecepata),

        sastojci: odabraniSastojci.map(sastojak => {
            const pravilo = pravilaSastojaka[sastojak.naziv];

            if (!pravilo) {
                throw new Error(`Nema pravila za sastojak: ${sastojak.naziv}.`);
            }

            const jedinica = jedinice.find(j =>
                j.naziv.toLowerCase() === pravilo.mjera.toLowerCase()
            );

            if (!jedinica) {
                throw new Error(`Mjerna jedinica ${pravilo.mjera} ne postoji.`);
            }

            return {
                sastojak: sastojak.id,
                kolicina: faker.number.int({
                    min: pravilo.min,
                    max: pravilo.max
                }),
                jedMjere: jedinica.id
            };
        }),

        priprema:
            "1. Pripremite sve sastojke.\n" +
            "2. Operite i narežite namirnice.\n" +
            "3. Pomiješajte sastojke i začinite po želji.\n" +
            "4. Termički obradite jelo prema odabranom receptu.\n" +
            "5. Poslužite.",

        omiljen: false,
        vegansko: false,
        generirano: true
    };
}

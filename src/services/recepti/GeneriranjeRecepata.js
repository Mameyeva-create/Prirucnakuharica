import { faker } from "@faker-js/faker";
import { sastojci } from "../sastojci/SastojakPodaci";


const kategorije = [
    'Doručak',
    'Ručak',
    'Večera',
    'Desert',
    'Juhe'
]
const pravilaSastojaka = {
    1: { min: 80, max: 150, mjera: 'g' },   // Tjestenina
    2: { min: 30, max: 80, mjera: 'g' },    // Panceta
    3: { min: 1, max: 3, mjera: 'kom' },    // Jaja
    4: { min: 20, max: 50, mjera: 'g' },    // Parmezan
    5: { min: 100, max: 250, mjera: 'g' },  // Brašno
    6: { min: 100, max: 250, mjera: 'ml' }, // Mlijeko
    7: { min: 10, max: 50, mjera: 'g' },    // Šećer
    8: { min: 5, max: 20, mjera: 'ml' },    // Ulje
    9: { min: 1, max: 5, mjera: 'g' },      // Sol
    10: { min: 1, max: 3, mjera: 'g' },      // Papar
    11: { min: 100, max: 200, mjera: 'g' }, // Pileća prsa
    12: { min: 50, max: 150, mjera: 'g' },  // Mrkva
    13: { min: 100, max: 200, mjera: 'g' }, // Krumpir
    14: { min: 50, max: 150, mjera: 'g' },  // Paprika
    15: { min: 30, max: 100, mjera: 'g' },  // Luk
    16: { min: 200, max: 300, mjera: 'g' }, // Tijesto za pizzu
    17: { min: 50, max: 100, mjera: 'g' },  // Umak od rajčice
    18: { min: 50, max: 100, mjera: 'g' },  // Mozzarella
    19: { min: 5, max: 15, mjera: 'g' },    // Svježi bosiljak
    20: { min: 50, max: 100, mjera: 'g' },  // Zelena salata
    21: { min: 20, max: 50, mjera: 'g' },   // Krutoni
    22: { min: 20, max: 50, mjera: 'g' },   // Cezar umak
    23: { min: 30, max: 100, mjera: 'g' },  // Čokolada za kuhanje
    24: { min: 20, max: 80, mjera: 'g' },   // Maslac
    25: { min: 5, max: 15, mjera: 'g' },    // Prašak za pecivo
    26: { min: 100, max: 200, mjera: 'g' }, // Tikvica
    27: { min: 100, max: 250, mjera: 'ml' } // Povrtni temeljac
};

const receptiNazivi = [
    'Tjestenina',
    'Povrtna juha',
    'Salata',
    'Rižoto',
    'Palačinke',
    'Pečeno povrće',
    'Čokoladni kolač'
]
let dostupniNazivi = [...receptiNazivi]

function odaberiNaziv() {
    if (dostupniNazivi.length === 0) {
        dostupniNazivi = [...receptiNazivi]
    }
    const indeks = faker.number.int({ min: 0, max: dostupniNazivi.length - 1 })
    return dostupniNazivi.splice(indeks, 1)[0]
}
const opisiRecepata = [
    'Jednostavan recept za ukusan obrok.',
    'Ukusno jelo koje se lako priprema.',
    'Odličan izbor za svakodnevni ručak.',
    'Brz i praktičan recept za cijelu obitelj.',
    'Ukusna kombinacija sastojaka za svaki dan.'
]
const sastojciPoReceptu = {
    'Tjestenina': [1, 2, 3, 4, 8, 9, 10],
    'Povrtna juha': [12, 13, 14, 15, 27, 9, 10],
    'Salata': [20, 21, 22, 12, 8, 9],
    'Rižoto': [15, 12, 27, 9, 10, 8],
    'Palačinke': [3, 5, 6, 7, 8],
    'Pečeno povrće': [12, 13, 14, 15, 26, 8, 9],
    'Čokoladni kolač': [3, 5, 7, 23, 24, 25, 6]
}

export function generirajRecept() {
    const brojSastojaka = faker.number.int({min: 3, max: 6})
    const naziv = odaberiNaziv()

    const moguciSastojci = sastojciPoReceptu[naziv]
        .map(id => sastojci.find(s => s.id === id))
        .filter(Boolean)

    const odabraniSastojci = faker.helpers.arrayElements(
        moguciSastojci,
        Math.min(brojSastojaka, moguciSastojci.length)
    )
    return {
        naziv: naziv,
        kategorija: faker.helpers.arrayElement(kategorije),
        vrijeme: faker.number.int({ min: 10, max: 60 }),
        slika: null,
        slikaPutanja: '',
        opis: faker.helpers.arrayElement(opisiRecepata),
        sastojci: odabraniSastojci.map((sastojak) => {
            const pravilo = pravilaSastojaka[sastojak.id]
            return {
                sastojak: sastojak.id,
                kolicina: faker.number.int({ min: pravilo.min, max: pravilo.max }),
                jedMjere: pravilo.mjera
            }
        }),
        priprema: '1. Pripremite sve sastojke.\n' +
            '2. Operite i narežite namirnice.\n' +
            '3. Pomiješajte sastojke i začinite po želji.\n' +
            '4. Termički obradite jelo prema odabranom receptu.\n' +
            '5. Poslužite.',
        omiljen: false,
        vegansko: false
    }
}
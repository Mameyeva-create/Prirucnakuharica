import cezarSalata from '../../assets/slike/cezar-salata.jpg'
import cokoladniKolac from '../../assets/slike/cokoladni-kolac.jpg'
import palacinke from '../../assets/slike/palacinke.jpg'
import piletina from '../../assets/slike/piletina.jpg'
import pizza from '../../assets/slike/pizza.jpg'
import povrtnaJuha from '../../assets/slike/povrtna-juha.jpg'

// Svaki sastojak sadrži ID sastojka, količinu i jedinicu mjere.

export const recepti = [
    {
        id: 1,
        naziv: 'Tjestenina Carbonara',
        kategorija: 'Ručak',
        vrijeme: 20,
        slikaPutanja: '/src/assets/slike/carbonara.jpg',
        opis: 'Jednostavna i iskusna tjestenina s jajima,sirom i pancetom.',
        sastojci: [
            { sastojak: 1, kolicina: 200, jedMjere: 'g' },
            { sastojak: 2, kolicina: 100, jedMjere: 'g' },
            { sastojak: 3, kolicina: 2, jedMjere: 'kom' },
            { sastojak: 4, kolicina: 50, jedMjere: 'g' },
            { sastojak: 9, kolicina: 1, jedMjere: 'prstohvat' },
            { sastojak: 10, kolicina: 1, jedMjere: 'po ukusu' }
        ],
        priprema: '1. Skuhajte tjesteninu prema uputama na pakiranju.\n2. Narežite pancetu i popržite je na tavi.\n3. Umutite jaja i naribani sir.\n4. Pomiješajte vruću tjesteninu s pancetom i smjesom jaja i sira.\n5. Poslužite odmah.',
        omiljen: true,
        vegansko: false
    },
    {
        id: 2,
        naziv: 'Palačinke',
        kategorija: 'Doručak',
        vrijeme: 15,
        slika: palacinke,
        slikaPutanja: '/src/assets/slike/palacinke.jpg',
        opis: 'Brze i jednostavne palačinke koje možete poslužiti sa slatkim nadjevom.',
        sastojci: [
            { sastojak: 5, kolicina: 200, jedMjere: 'g' },
            { sastojak: 6, kolicina: 300, jedMjere: 'ml' },
            { sastojak: 3, kolicina: 2, jedMjere: 'kom' },
            { sastojak: 7, kolicina: 1, jedMjere: 'žlica' },
            { sastojak: 8, kolicina: 1, jedMjere: 'žlica' },
            { sastojak: 9, kolicina: 1, jedMjere: 'prstohvat' }
        ],
        priprema: '1. Pomiješajte brašno, mlijeko, jaja i malo šećera.\n2. Miješajte dok ne dobijete glatku smjesu.\n3. Zagrijte tavu i lagano je nauljite.\n4. Ulijte malo smjese i pecite palačinku s obje strane.\n5. Poslužite s omiljenim nadjevom.',
        omiljen: false,
        vegansko: true
    },
    {
        id: 3,
        naziv: 'Piletina s povrćem',
        kategorija: 'Ručak',
        vrijeme: 35,
        slika: piletina,
        slikaPutanja: '/src/assets/slike/piletina.jpg',
        opis: 'Ukusan i jednostavan obrok s pileetinom i svježim povrćem.',
        sastojci: [
            { sastojak: 11, kolicina: 300, jedMjere: 'g' },
            { sastojak: 13, kolicina: 300, jedMjere: 'g' },
            { sastojak: 12, kolicina: 150, jedMjere: 'g' },
            { sastojak: 14, kolicina: 1, jedMjere: 'kom' },
            { sastojak: 15, kolicina: 1, jedMjere: 'glavica' },
            { sastojak: 28, kolicina: 2, jedMjere: 'žlica' },
            { sastojak: 9, kolicina: 1, jedMjere: 'prstohvat' },
            { sastojak: 10, kolicina: 1, jedMjere: 'po ukusu' }
        ],
        priprema: '1. Narežite piletinu i povrće na manje komade.\n2. Začinite solju, paprom i omiljenim začinima.\n3. Stavite sve u posudu za pečenje i dodajte malo ulja.\n4. Pecite na 200 °C oko 25–30 minuta, dok piletina nije potpuno pečena.\n5. Poslužite toplo.',
        omiljen: true,
        vegansko: true
    },
    {
        id: 4,
        naziv: 'Pizza Margherita',
        kategorija: 'Večera',
        vrijeme: 30,
        slika: pizza,
        slikaPutanja: '/src/assets/slike/pizza.jpg',
        opis: 'Klasična talijanska pizza s rajčicom, mozzarellom i svježim bosiljkom.',
        sastojci: [
            { sastojak: 16, kolicina: 1, jedMjere: 'kom' },
            { sastojak: 17, kolicina: 100, jedMjere: 'g' },
            { sastojak: 18, kolicina: 150, jedMjere: 'g' },
            { sastojak: 19, kolicina: 1, jedMjere: 'nekoliko listova' },
            { sastojak: 9, kolicina: 1, jedMjere: 'prstohvat' },
            { sastojak: 10, kolicina: 1, jedMjere: 'po ukusu' }
        ],
        priprema: '1. Razvaljajte tijesto za pizzu.\n2. Premažite tijesto umakom od rajčice.\n3. Dodajte narezanu mozzarellu.\n4. Pecite u prethodno zagrijanoj pećnici na 220 °C oko 10–15 minuta, ovisno o tijestu.\n5. Dodajte svježi bosiljak i poslužite.',
        omiljen: false,
        vegansko: true

    },
    {
        id: 5,
        naziv: 'Cezar salata',
        kategorija: 'Ručak',
        vrijeme: 20,
        slika: cezarSalata,
        slikaPutanja: '/src/assets/slike/cezar-salata.jpg',
        opis: 'Svježa salata s piletinom, hrskavim krutonima, parmezanom i Cezar umakom.',
        sastojci: [
            { sastojak: 20, kolicina: 200, jedMjere: 'g' },
            { sastojak: 11, kolicina: 200, jedMjere: 'g' },
            { sastojak: 21, kolicina: 50, jedMjere: 'g' },
            { sastojak: 22, kolicina: 3, jedMjere: 'žlica' },
            { sastojak: 4, kolicina: 30, jedMjere: 'g' },
            { sastojak: 9, kolicina: 1, jedMjere: 'prstohvat' },
            { sastojak: 10, kolicina: 1, jedMjere: 'po ukusu' }
        ],
        priprema: '1. Operite i narežite salatu.\n2. Začinite piletinu i ispecite je u tavi.\n3. Narežite pečenu piletinu na komade.\n4. Pomiješajte salatu, piletinu, krutone i Cezar umak.\n5. Pospite parmezanom i poslužite.',
        omiljen: true,
        vegansko: false
    },
    {
        id: 6,
        naziv: 'Čokoladni kolač',
        kategorija: 'Desert',
        vrijeme: 45,
        slika: cokoladniKolac,
        slikaPutanja: '/src/assets/slike/cokoladni-kolac.jpg',
        opis: 'Sočan i mekan čokoladni kolač bogatog okusa, idealan za sve ljubitelje čokolade.',
        sastojci: [
            { sastojak: 23, kolicina: 200, jedMjere: 'g' },
            { sastojak: 24, kolicina: 150, jedMjere: 'g' },
            { sastojak: 3, kolicina: 3, jedMjere: 'kom' },
            { sastojak: 5, kolicina: 150, jedMjere: 'g' },
            { sastojak: 7, kolicina: 150, jedMjere: 'g' },
            { sastojak: 25, kolicina: 1, jedMjere: 'žličica' },
            { sastojak: 6, kolicina: 100, jedMjere: 'ml' }
        ],
        priprema: '1. Zagrijte pećnicu na 180 °C.\n2. Otopite čokoladu.\n3. Umutite jaja i šećer, zatim dodajte otopljenu čokoladu i brašno.\n4. Izlijte smjesu u namašćen kalup.\n5. Pecite oko 25–30 minuta i ostavite da se ohladi.',
        omiljen: false,
        vegansko: true
    },
    {
        id: 7,
        naziv: 'Povrtna juha',
        kategorija: 'Ručak',
        vrijeme: 25,
        slika: povrtnaJuha,
        slikaPutanja: '/src/assets/slike/povrtna-juha.jpg',
        opis: 'Lagana i zdrava juha od svježeg povrća, savršena za svaki dan.',
        sastojci: [
            { sastojak: 12, kolicina: 2, jedMjere: 'kom' },
            { sastojak: 13, kolicina: 2, jedMjere: 'kom' },
            { sastojak: 14, kolicina: 1, jedMjere: 'kom' },
            { sastojak: 15, kolicina: 1, jedMjere: 'glavica' },
            { sastojak: 26, kolicina: 1, jedMjere: 'kom' },
            { sastojak: 27, kolicina: 1, jedMjere: 'l' },
            { sastojak: 28, kolicina: 2, jedMjere: 'žlica' },
            { sastojak: 9, kolicina: 1, jedMjere: 'prstohvat' },
            { sastojak: 10, kolicina: 1, jedMjere: 'po ukusu' }
        ],
        priprema: '1. Operite i narežite povrće na kockice.\n2. Nasjeckajte luk i kratko ga popržite u loncu.\n3. Dodajte ostalo povrće i vodu.\n4. Kuhajte oko 20 minuta, dok povrće ne omekša.\n5. Začinite po želji i poslužite toplo.',
        omiljen: false,
        vegansko: true

    }

]

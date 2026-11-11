
// Svaki sastojak sadrži ID sastojka, količinu i jedinicu mjere.
import {
    slikaTjesteninaCarbonara, slikaPalacinke, slikaPiletinaSPovrcem,
    slikaPizzaMargherita, slikaCezarSalata, slikaCokoladniKolac, slikaPovrtnaJuha,
} from './slikeRecepata'


// Svaki sastojak sadrži ID sastojka, količinu i ID jedinice mjere
export const recepti = [
    {
        id: 1,
        naziv: 'Tjestenina Carbonara',
        kategorija: 'Ručak',
        vrijeme: 20,
        slikaPutanja: '/slike/carbonara.jpg',
        slikaBase64: slikaTjesteninaCarbonara,
        opis: 'Jednostavna i iskusna tjestenina s jajima,sirom i pancetom.',
        sastojci: [
            { sastojak: 1, kolicina: 200, jedMjere: 1 },
            { sastojak: 2, kolicina: 100, jedMjere: 1 },
            { sastojak: 3, kolicina: 2, jedMjere: 7 },
            { sastojak: 4, kolicina: 50, jedMjere: 1 },
            { sastojak: 9, kolicina: 1, jedMjere: 6 },
            { sastojak: 10, kolicina: 1, jedMjere: 11 }
        ],
        priprema: '1. Skuhajte tjesteninu prema uputama na pakiranju.\n2. Narežite pancetu i popržite je na tavi.\n3. Umutite jaja i naribani sir.\n4. Pomiješajte vruću tjesteninu s pancetom i smjesom jaja i sira.\n5. Poslužite odmah.',
        omiljen: true,
        vegansko: false,
        generirano: false
    },
    {
        id: 2,
        naziv: 'Palačinke',
        kategorija: 'Doručak',
        vrijeme: 15,
        slikaPutanja: '/slike/palacinke.jpg',
        slikaBase64: slikaPalacinke,
        opis: 'Brze i jednostavne palačinke koje možete poslužiti sa slatkim nadjevom.',
        sastojci: [
            { sastojak: 5, kolicina: 200, jedMjere: 1 },
            { sastojak: 6, kolicina: 300, jedMjere: 8 },
            { sastojak: 3, kolicina: 2, jedMjere: 7 },
            { sastojak: 7, kolicina: 2, jedMjere: 5 },
            { sastojak: 8, kolicina: 1, jedMjere: 5 },
            { sastojak: 9, kolicina: 1, jedMjere: 6 }
        ],
        priprema: '1. Pomiješajte brašno, mlijeko, jaja i malo šećera.\n2. Miješajte dok ne dobijete glatku smjesu.\n3. Zagrijte tavu i lagano je nauljite.\n4. Ulijte malo smjese i pecite palačinku s obje strane.\n5. Poslužite s omiljenim nadjevom.',
        omiljen: false,
        vegansko: false,
        generirano: false
    },
    {
        id: 3,
        naziv: 'Piletina s povrćem',
        kategorija: 'Ručak',
        vrijeme: 35,
        slikaPutanja: '/slike/piletina.jpg',
        slikaBase64: slikaPiletinaSPovrcem,
        opis: 'Ukusan i jednostavan obrok s pileetinom i svježim povrćem.',
        sastojci: [
            { sastojak: 11, kolicina: 500, jedMjere: 1 },
            { sastojak: 12, kolicina: 2, jedMjere: 7 },
            { sastojak: 13, kolicina: 2, jedMjere: 7 },
            { sastojak: 14, kolicina: 1, jedMjere: 7 },
            { sastojak: 15, kolicina: 1, jedMjere: 10 },
            { sastojak: 28, kolicina: 2, jedMjere: 5 },
            { sastojak: 9, kolicina: 1, jedMjere: 6 },
            { sastojak: 10, kolicina: 1, jedMjere: 11 }
        ],
        priprema: '1. Narežite piletinu i povrće na manje komade.\n2. Začinite solju, paprom i omiljenim začinima.\n3. Stavite sve u posudu za pečenje i dodajte malo ulja.\n4. Pecite na 200 °C oko 25–30 minuta, dok piletina nije potpuno pečena.\n5. Poslužite toplo.',
        omiljen: true,
        vegansko: false,
        generirano: false
    },
    {
        id: 4,
        naziv: 'Pizza Margherita',
        kategorija: 'Večera',
        vrijeme: 30,
        slikaPutanja: '/slike/pizza.jpg',
        slikaBase64: slikaPizzaMargherita,
        opis: 'Klasična talijanska pizza s rajčicom, mozzarellom i svježim bosiljkom.',
        sastojci: [
            { sastojak: 16, kolicina: 1, jedMjere: 7 },
            { sastojak: 17, kolicina: 100, jedMjere: 1 },
            { sastojak: 18, kolicina: 125, jedMjere: 1 },
            { sastojak: 19, kolicina: 1, jedMjere: 12 },
            { sastojak: 28, kolicina: 1, jedMjere: 5 },
            { sastojak: 9, kolicina: 1, jedMjere: 6 }
        ],
        priprema: '1. Razvaljajte tijesto za pizzu.\n2. Premažite tijesto umakom od rajčice.\n3. Dodajte narezanu mozzarellu.\n4. Pecite u prethodno zagrijanoj pećnici na 220 °C oko 10–15 minuta, ovisno o tijestu.\n5. Dodajte svježi bosiljak i poslužite.',
        omiljen: false,
        vegansko: false,
        generirano: false

    },
    {
        id: 5,
        naziv: 'Cezar salata',
        kategorija: 'Ručak',
        vrijeme: 20,
        slikaPutanja: '/slike/cezar-salata.jpg',
        slikaBase64: slikaCezarSalata,
        opis: 'Svježa salata s piletinom, hrskavim krutonima, parmezanom i Cezar umakom.',
        sastojci: [
            { sastojak: 11, kolicina: 300, jedMjere: 1 },
            { sastojak: 20, kolicina: 1, jedMjere: 12 },
            { sastojak: 21, kolicina: 100, jedMjere: 1 },
            { sastojak: 4, kolicina: 30, jedMjere: 1 },
            { sastojak: 22, kolicina: 100, jedMjere: 8 },
            { sastojak: 9, kolicina: 1, jedMjere: 6 },
            { sastojak: 10, kolicina: 1, jedMjere: 11 }
        ],
        priprema: '1. Operite i narežite salatu.\n2. Začinite piletinu i ispecite je u tavi.\n3. Narežite pečenu piletinu na komade.\n4. Pomiješajte salatu, piletinu, krutone i Cezar umak.\n5. Pospite parmezanom i poslužite.',
        omiljen: true,
        vegansko: false,
        generirano: false
    },
    {
        id: 6,
        naziv: 'Čokoladni kolač',
        kategorija: 'Desert',
        vrijeme: 45,
        slikaPutanja: '/slike/cokoladni-kolac.jpg',
        slikaBase64: slikaCokoladniKolac,
        opis: 'Sočan i mekan čokoladni kolač bogatog okusa, idealan za sve ljubitelje čokolade.',
        sastojci: [
           { sastojak: 23, kolicina: 200, jedMjere: 1 },
            { sastojak: 5, kolicina: 150, jedMjere: 1 },
            { sastojak: 7, kolicina: 150, jedMjere: 1 },
            { sastojak: 24, kolicina: 100, jedMjere: 1 },
            { sastojak: 3, kolicina: 3, jedMjere: 7 },
            { sastojak: 25, kolicina: 1, jedMjere: 9 }
        ],
        priprema: '1. Zagrijte pećnicu na 180 °C.\n2. Otopite čokoladu.\n3. Umutite jaja i šećer, zatim dodajte otopljenu čokoladu i brašno.\n4. Izlijte smjesu u namašćen kalup.\n5. Pecite oko 25–30 minuta i ostavite da se ohladi.',
        omiljen: false,
        vegansko: false,
        generirano: false
    },
    {
        id: 7,
        naziv: 'Povrtna juha',
        kategorija: 'Ručak',
        vrijeme: 25,
        slikaPutanja: '/slike/povrtna-juha.jpg',
        slikaBase64: slikaPovrtnaJuha,
        opis: 'Lagana i zdrava juha od svježeg povrća, savršena za svaki dan.',
        sastojci: [
            { sastojak: 12, kolicina: 2, jedMjere: 7 },
            { sastojak: 13, kolicina: 2, jedMjere: 7 },
            { sastojak: 26, kolicina: 1, jedMjere: 7 },
            { sastojak: 15, kolicina: 1, jedMjere: 10 },
            { sastojak: 27, kolicina: 1, jedMjere: 4 },
            { sastojak: 28, kolicina: 1, jedMjere: 5 },
            { sastojak: 9, kolicina: 1, jedMjere: 6 },
            { sastojak: 10, kolicina: 1, jedMjere: 11 }
        ],
        priprema: '1. Operite i narežite povrće na kockice.\n2. Nasjeckajte luk i kratko ga popržite u loncu.\n3. Dodajte ostalo povrće i vodu.\n4. Kuhajte oko 20 minuta, dok povrće ne omekša.\n5. Začinite po želji i poslužite toplo.',
        omiljen: false,
        vegansko: true,
        generirano: false
    },

]

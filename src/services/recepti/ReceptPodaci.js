import carbonara from '../../assets/slike/carbonara.jpg'
import cezarSalata from '../../assets/slike/cezar-salata.jpg'
import cokoladniKolac from '../../assets/slike/cokoladni-kolac.jpg'
import palacinke from '../../assets/slike/palacinke.jpg'
import piletina from '../../assets/slike/piletina.jpg'
import pizza from '../../assets/slike/pizza.jpg'
import povrtnaJuha from '../../assets/slike/povrtna-juha.jpg'

// Svaki sastojak ima naziv, količinu, jedinicu i opcionalnu napomenu.
// Ako količina nije brojčano određena, koristimo null i napomenu.


export const recepti = [
    {
        id: 1,
        naziv: 'Tjestenina Carbonara',
        kategorija: 'Ručak',
        vrijeme: 20,
        slika: carbonara,
        slikaPutanja: '/src/assets/slike/carbonara.jpg',
        opis: 'Jednostavna i iskusna tjestenina s jajima,sirom i pancetom.',
        sastojci: [
            { sastojak: 1, jedinicaMjere: 1, kolicina: 200 },
            { sastojak: 2, jedinicaMjere: 1, kolicina: 100 },
            { sastojak: 3, jedinicaMjere: 7, kolicina: 2 },
            { sastojak: 4, jedinicaMjere: 1, kolicina: 50 },
            { sastojak: 9, jedinicaMjere: null, kolicina: null, napomena: 'po ukusu' },
            { sastojak: 10, jedinicaMjere: null, kolicina: null, napomena: 'po ukusu' }
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
            {
                sastojak: 1,
                jedinicaMjere: 1,
                kolicina: 200,

            },
            {
                sastojak: 2,
                jedinicaMjere: 1,
                kolicina: 100,

            },
            {
                sastojak: 7,
                jedinicaMjere: 2,
                kolicina: 1,

            }
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
            {
                sastojak: 1,
                jedinicaMjere: 1,
                kolicina: 200,

            },
            {
                sastojak: 2,
                jedinicaMjere: 1,
                kolicina: 100,

            },
            {
                sastojak: 7,
                jedinicaMjere: 2,
                kolicina: 1,

            }
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
            {
                sastojak: 1,
                jedinicaMjere: 1,
                kolicina: 200,

            },
            {
                sastojak: 2,
                jedinicaMjere: 1,
                kolicina: 100,

            },
            {
                sastojak: 7,
                jedinicaMjere: 2,
                kolicina: 1,

            }
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
            {
                sastojak: 1,
                jedinicaMjere: 1,
                kolicina: 200,

            },
            {
                sastojak: 2,
                jedinicaMjere: 1,
                kolicina: 100,

            },
            {
                sastojak: 7,
                jedinicaMjere: 2,
                kolicina: 1,

            }
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
            {
                sastojak: 1,
                jedinicaMjere: 1,
                kolicina: 200,

            },
            {
                sastojak: 2,
                jedinicaMjere: 1,
                kolicina: 100,

            },
            {
                sastojak: 7,
                jedinicaMjere: 2,
                kolicina: 1,

            }
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
            {
                sastojak: 1,
                jedinicaMjere: 1,
                kolicina: 200,

            },
            {
                sastojak: 2,
                jedinicaMjere: 1,
                kolicina: 100,

            },
            {
                sastojak: 7,
                jedinicaMjere: 2,
                kolicina: 1,

            }
        ],
        priprema: '1. Operite i narežite povrće na kockice.\n2. Nasjeckajte luk i kratko ga popržite u loncu.\n3. Dodajte ostalo povrće i vodu.\n4. Kuhajte oko 20 minuta, dok povrće ne omekša.\n5. Začinite po želji i poslužite toplo.',
        omiljen: false,
        vegansko: true

    }

]

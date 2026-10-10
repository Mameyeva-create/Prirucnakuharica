import carbonara from '../../assets/slike/carbonara.jpg'
import cezarSalata from '../../assets/slike/cezar-salata.jpg'
import cokoladniKolac from '../../assets/slike/cokoladni-kolac.jpg'
import palacinke from '../../assets/slike/palacinke.jpg'
import piletina from '../../assets/slike/piletina.jpg'
import pizza from '../../assets/slike/pizza.jpg'
import povrtnaJuha from '../../assets/slike/povrtna-juha.jpg'


export const recepti = [
    {
        id: 1,
        naziv: 'Tjestenina Carbonara',
        kategorija: 'Ručak',
        vrijeme: 20,
        slika: carbonara,
        opis: 'Jednostavna i iskusna tjestenina s jajima,sirom i pancetom.',
        sastojci: [
            '200 g tjestenine',
            '100 g pancete',
            '2 jaja',
            '50 g parmezana',
            'sol i papar po ukusu'
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
        opis: 'Brze i jednostavne palačinke koje možete poslužiti sa slatkim nadjevom.',
        sastojci: [
            '200 g glatkog brašna',
            '300 ml mlijeka',
            '2 jaja',
            '1 žlica šećera',
            '1 žlica ulja',
            'prstohvat soli'
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
        opis: 'Ukusan i jednostavan obrok s pileetinom i svježim povrćem.',
        sastojci: [
            '400 g pilećih prsa',
            '2 mrkve',
            '3 krumpira',
            '1 paprika',
            '1 glavica luka',
            '2 žlice ulja',
            'sol i papar po ukusu'
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
        opis: 'Klasična talijanska pizza s rajčicom, mozzarellom i svježim bosiljkom.',
        sastojci: [
            '300 g tijesta za pizzu',
            '150 g umaka od rajčice',
            '200 g mozzarelle',
            'nekoliko listova svježeg bosiljka',
            '1 žlica maslinovog ulja'
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
        opis: 'Svježa salata s piletinom, hrskavim krutonima, parmezanom i Cezar umakom.',
        sastojci: [
            '300 g pilećih prsa',
            '1 glavica zelene salate',
            '80 g krutona',
            '40 g parmezana',
            '3 žlice Cezar umaka'
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
        opis: 'Sočan i mekan čokoladni kolač bogatog okusa, idealan za sve ljubitelje čokolade.',
        sastojci: [
            '200 g čokolade za kuhanje',
            '150 g brašna',
            '120 g šećera',
            '3 jaja',
            '100 g maslaca',
            '1 žličica praška za pecivo'
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
        opis: 'Lagana i zdrava juha od svježeg povrća, savršena za svaki dan.',
        sastojci: [
            '2 mrkve',
            '3 krumpira',
            '1 glavica luka',
            '1 tikvica',
            '1,2 l vode ili povrtnog temeljca',
            '1 žlica ulja',
            'sol i papar po ukusu'
        ],
        priprema: '1. Operite i narežite povrće na kockice.\n2. Nasjeckajte luk i kratko ga popržite u loncu.\n3. Dodajte ostalo povrće i vodu.\n4. Kuhajte oko 20 minuta, dok povrće ne omekša.\n5. Začinite po želji i poslužite toplo.',
        omiljen: false,
        vegansko: true

    }

]

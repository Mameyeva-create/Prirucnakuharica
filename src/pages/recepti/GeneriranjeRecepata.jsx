
import GeneratorKartica from '../../components/GeneratorKartica'
import ReceptService from '../../services/recepti/ReceptService'
import KategorijaService from '../../services/kategorije/KategorijaService'
import SastojakService from '../../services/sastojci/SastojakService'
import JedinicaMjereService from '../../services/jedinicaMjere/JedinicaMjereService'
import {
    normalizirajNaziv, jedinstvenNaziv,
    dohvatiKoristene, obrisiGenerirane,
} from '../../Generiranje'


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
// Pronađi stavku po nazivu ili je automatski dodaj (kategorija, sastojak, jedinica)
async function osiguraj(servis, naziv, popis) {
    const trazeni = normalizirajNaziv(naziv)
    let stavka = popis.find(x => normalizirajNaziv(x.naziv) === trazeni)
    if (stavka) return stavka

    await servis.dodaj({ naziv, generirano: true, izRecepta: true })
    popis.splice(0, popis.length, ...((await servis.get()).data || []))

    stavka = popis.find(x => normalizirajNaziv(x.naziv) === trazeni)
    if (!stavka) throw new Error(`"${naziv}" nije uspješno dodan.`)
    return stavka
}

async function generiraj(broj) {
    const [r, k, s, j] = await Promise.all([
        ReceptService.get(),
        KategorijaService.get(),
        SastojakService.get(),
        JedinicaMjereService.get(),
    ])
    const kategorije = k.data || []
    const sastojciPopis = s.data || []
    const jedinice = j.data || []
    const zauzeti = new Set((r.data || []).map(x => normalizirajNaziv(x.naziv)))

    let dodano = 0
    try {
        for (let i = 0; i < broj; i++) {
            const p = predlosci[i % predlosci.length]
            const kategorija = await osiguraj(KategorijaService, p.kategorija, kategorije)

            const sastojci = []
            for (const [nazivS, kol, nazivJ] of p.sastojci) {
                const sastojak = await osiguraj(SastojakService, nazivS, sastojciPopis)
                const jedinica = await osiguraj(JedinicaMjereService, nazivJ, jedinice)
                sastojci.push({
                    sastojak: Number(sastojak.id),
                    kolicina: Math.max(1, Math.round(kol * (0.9 + Math.random() * 0.2))),
                    jedMjere: Number(jedinica.id),
                })
            }

            await ReceptService.dodaj({
                naziv: jedinstvenNaziv(p.naziv, zauzeti),
                kategorija: kategorija.naziv,
                vrijeme: p.vrijeme,
                slikaPutanja: p.slikaPutanja,
                opis: p.opis,
                sastojci,
                priprema: p.priprema,
                omiljen: false,
                vegansko: p.vegansko,
                generirano: true,
            })
            dodano++
        }
    } catch (error) {
        throw new Error(`Dodano recepata: ${dodano}. ${error.message}`)
    }
    return `Uspješno generirano testnih recepata: ${dodano}.`
}

async function obrisi() {
    // 1. prvo recepti
    const recepti = await obrisiGenerirane(ReceptService)

    // 2. zatim samo ono što je generator recepata sam stvorio, a nitko ne koristi
    const izRecepta = x => x.izRecepta === true
    const koristeni = await dohvatiKoristene()
    const kategorije = await obrisiGenerirane(KategorijaService, koristeni.kategorije, k => normalizirajNaziv(k.naziv), izRecepta)
    const sastojci = await obrisiGenerirane(SastojakService, koristeni.sastojci, undefined, izRecepta)
    const jedinice = await obrisiGenerirane(JedinicaMjereService, koristeni.jedinice, undefined, izRecepta)

    return `Obrisano recepata: ${recepti.obrisano}. ` +
        `Dodatno obrisano što je generator recepata stvorio: kategorija ${kategorije.obrisano}, ` +
        `sastojaka ${sastojci.obrisano}, jedinica mjere ${jedinice.obrisano}.`
}

export default function GeneriranjeRecepata() {
    return (
        <GeneratorKartica
            naslov="Generiranje testnih recepata"
            labelBroj="Broj recepata za generiranje"
            pocetniBroj={10}
            putanjaPrikaza="/recepti?generirani=true"
            tekstGeneriraj="Generiraj recepte"
            tekstPrikaza="Prikaži generirane recepte"
            tekstBrisanja="Obriši generirane recepte"
            potvrdaBrisanja="Obrisati generirane recepte i njihove nekorištene generirane sastojke, jedinice i kategorije?"
            generiraj={generiraj}
            obrisi={obrisi}
        />
    )
}
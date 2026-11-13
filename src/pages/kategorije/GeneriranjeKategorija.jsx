import GeneratorKartica from '../../components/GeneratorKartica'
import KategorijaService from '../../services/kategorije/KategorijaService'
import {
    normalizirajNaziv, jedinstvenNaziv,
    dohvatiKoristene, obrisiGenerirane, porukaBrisanja,
} from '../../Generiranje'

const NAZIVI = [
    'Juhe', 'Salate', 'Tjestenine', 'Riba', 'Mesna jela', 'Prilozi', 'Umaci',
    'Deserti', 'Peciva', 'Vegetarijanska jela', 'Veganska jela', 'Smoothie',
    'Sendviči', 'Variva', 'Grickalice',
]

async function generiraj(broj) {
    const postojece = (await KategorijaService.get()).data || []
    const zauzeti = new Set(postojece.map(k => normalizirajNaziv(k.naziv)))

    for (let i = 0; i < broj; i++) {
        const naziv = jedinstvenNaziv(NAZIVI[i % NAZIVI.length], zauzeti)
        await KategorijaService.dodaj({ naziv, generirano: true })
    }
    return `Uspješno generirano testnih kategorija: ${broj}.`
}

async function obrisi() {
    const koristeni = await dohvatiKoristene()
    const rezultat = await obrisiGenerirane(KategorijaService, koristeni.kategorije)
    return porukaBrisanja('kategorije', rezultat)
}

export default function GeneriranjeKategorija() {
    return (
        <GeneratorKartica
            naslov="Generiranje testnih kategorija"
            labelBroj="Broj kategorija za generiranje"
            putanjaPrikaza="/kategorije"
            tekstGeneriraj="Generiraj kategorije"
            tekstPrikaza="Prikaži kategorije"
            tekstBrisanja="Obriši generirane kategorije"
            potvrdaBrisanja="Obrisati generirane kategorije koje se ne koriste u receptima?"
            generiraj={generiraj}
            obrisi={obrisi}
        />
    )
}
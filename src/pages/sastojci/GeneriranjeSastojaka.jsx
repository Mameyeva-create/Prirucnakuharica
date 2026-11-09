import GeneratorKartica from '../../components/GeneratorKartica'
import SastojakService from '../../services/sastojci/SastojakService'
import {
    normalizirajNaziv, jedinstvenNaziv,
    dohvatiKoristene, obrisiGenerirane, porukaBrisanja,
} from '../../Generiranje'

const NAZIVI = [
    'Batat', 'Brokula', 'Češnjak', 'Cvjetača', 'Gljive', 'Grašak', 'Grah',
    'Jogurt', 'Kiselo vrhnje', 'Kukuruz', 'Limun', 'Med', 'Naranča', 'Orah',
    'Peršin', 'Rajčica', 'Riža', 'Ružmarin', 'Sir', 'Špinat', 'Tuna',
    'Vanilija', 'Vlasac', 'Zobene pahuljice', 'Bademi', 'Avokado',
    'Kokosovo mlijeko', 'Losos', 'Patlidžan', 'Šampinjoni',
]

async function generiraj(broj) {
    const postojece = (await SastojakService.get()).data || []
    const zauzeti = new Set(postojece.map(s => normalizirajNaziv(s.naziv)))

    for (let i = 0; i < broj; i++) {
        const naziv = jedinstvenNaziv(NAZIVI[i % NAZIVI.length], zauzeti)
        await SastojakService.dodaj({ naziv, generirano: true })
    }
    return `Uspješno generirano testnih sastojaka: ${broj}.`
}

async function obrisi() {
    const koristeni = await dohvatiKoristene()
    const rezultat = await obrisiGenerirane(SastojakService, koristeni.sastojci)
    return porukaBrisanja('sastojci', rezultat)
}

export default function GeneriranjeSastojaka() {
    return (
        <GeneratorKartica
            naslov="Generiranje testnih sastojaka"
            labelBroj="Broj sastojaka za generiranje"
            putanjaPrikaza="/sastojci"
            tekstGeneriraj="Generiraj sastojke"
            tekstPrikaza="Prikaži sastojke"
            tekstBrisanja="Obriši generirane sastojke"
            potvrdaBrisanja="Obrisati generirane sastojke koji se ne koriste u receptima?"
            generiraj={generiraj}
            obrisi={obrisi}
        />
    )
}
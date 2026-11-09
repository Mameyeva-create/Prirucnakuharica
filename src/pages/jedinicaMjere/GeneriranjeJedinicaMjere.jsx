import GeneratorKartica from '../../components/GeneratorKartica'
import JedinicaMjereService from '../../services/jedinicaMjere/JedinicaMjereService'
import {
    normalizirajNaziv, jedinstvenNaziv,
    dohvatiKoristene, obrisiGenerirane, porukaBrisanja,
} from '../../Generiranje'

const NAZIVI = [
     'g', 'dk', 'kg', 'l', 'ml', 'kom', 'žlica', 'žličica', 'prstohvat',
    'glavica', 'po ukusu', 'nekoliko listova', 'po potrebi',
    'mg', 'dag', 'dl', 'cl', 'šalica', 'čaša', 'češanj', 'kriška',
    'grančica', 'šaka', 'vrećica', 'konzerva', 'kockica', 'režanj',
    'štapić', 'list', 'paketić',
]

async function generiraj(broj) {
    const postojece = (await JedinicaMjereService.get()).data || []
    const zauzeti = new Set(postojece.map(j => normalizirajNaziv(j.naziv)))
    for (let i = 0; i < broj; i++) {
        const naziv = jedinstvenNaziv(NAZIVI[i % NAZIVI.length], zauzeti)
        await JedinicaMjereService.dodaj({ naziv, generirano: true })
    }
    return `Uspješno generirano testnih jedinica mjere: ${broj}.`
}

async function obrisi() {
    const koristeni = await dohvatiKoristene()
    const rezultat = await obrisiGenerirane(JedinicaMjereService, koristeni.jedinice)
    return porukaBrisanja('jedinice mjere', rezultat)
}

export default function GeneriranjeJedinicaMjere() {
    return (
        <GeneratorKartica
            naslov="Generiranje testnih jedinica mjere"
            labelBroj="Broj jedinica mjere za generiranje"
            pocetniBroj={5}
            putanjaPrikaza="/jediniceMjere"
            tekstGeneriraj="Generiraj jedinice mjere"
            tekstPrikaza="Prikaži jedinice mjere"
            tekstBrisanja="Obriši generirane jedinice mjere"
            potvrdaBrisanja="Obrisati generirane jedinice mjere koje se ne koriste u receptima?"
            generiraj={generiraj}
            obrisi={obrisi}
        />
    )
}


    
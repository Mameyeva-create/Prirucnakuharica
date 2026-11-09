import GeneratorKartica from '../../components/GeneratorKartica'
import JedinicaMjereService from '../../services/jedinicaMjere/JedinicaMjereService'
import {
    normalizirajNaziv,
    dohvatiKoristene, obrisiGenerirane, porukaBrisanja,
} from '../../Generiranje'

const NAZIVI = [
    'g', 'dk', 'kg', 'l', 'ml', 'kom', 'žlica', 'žličica', 'prstohvat',
    'glavica', 'po ukusu', 'nekoliko listova', 'po potrebi',
]

async function generiraj(broj) {
    const postojece = (await JedinicaMjereService.get()).data || []
    const zauzeti = new Set(postojece.map(j => normalizirajNaziv(j.naziv)))
    const slobodne = NAZIVI.filter(n => !zauzeti.has(normalizirajNaziv(n)))

    if (slobodne.length === 0) {
        return 'Sve jedinice mjere s popisa već postoje.'
    }

    const odabrane = slobodne.slice(0, broj)
    for (const naziv of odabrane) {
        await JedinicaMjereService.dodaj({ naziv, generirano: true })
    }

    return odabrane.length < broj
        ? `Generirano: ${odabrane.length}. Više nema slobodnih naziva na popisu.`
        : `Uspješno generirano testnih jedinica mjere: ${odabrane.length}.`
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
            max={NAZIVI.length}
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


    
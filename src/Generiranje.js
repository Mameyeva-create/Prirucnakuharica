import ReceptService from './services/recepti/ReceptService'

export function normalizirajNaziv(naziv) {
    return String(naziv)
        .toLocaleLowerCase('hr')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}
// vraća slobodan naziv i odmah ga bilježi u skup zauzetih
export function jedinstvenNaziv(osnovni, zauzeti) {
    let naziv = osnovni
    let broj = 2
    while (zauzeti.has(normalizirajNaziv(naziv))) {
        naziv = `${osnovni} (${broj})`
        broj++
    }
    zauzeti.add(normalizirajNaziv(naziv))
    return naziv
}
// što se trenutno koristi u receptima
export async function dohvatiKoristene() {
    const recepti = (await ReceptService.get()).data || []
    const kategorije = new Set()
    const sastojci = new Set()
    const jedinice = new Set()

    for (const r of recepti) {
        if (r.kategorija != null) kategorije.add(normalizirajNaziv(r.kategorija))
        for (const s of r.sastojci || []) {
            if (s.sastojak != null) sastojci.add(Number(s.sastojak))
            if (s.jedMjere != null) jedinice.add(Number(s.jedMjere))
        }
    }
    return { kategorije, sastojci, jedinice }
}

// briše generirane stavke koje se ne koriste u receptima
// kljuc određuje po čemu se stavka prepoznaje (zadano: id)
export async function obrisiGenerirane(
    servis,
    koristeni = new Set(),
    kljuc = x => Number(x.id),
    uvjet = () => true
) {
    const sve = (await servis.get()).data || []
    const generirane = sve.filter(x => x.generirano === true && uvjet(x))
    const zaBrisanje = generirane.filter(x => !koristeni.has(kljuc(x)))

    for (const x of zaBrisanje) {
        await servis.obrisi(x.id)
    }
    return {
        obrisano: zaBrisanje.length,
        preskoceno: generirane.length - zaBrisanje.length,
    }
}
export function porukaBrisanja(naziv, { obrisano, preskoceno }) {
    return `Obrisano generiranih (${naziv}): ${obrisano}.` +
        (preskoceno ? ` Preskočeno jer se koriste u receptima: ${preskoceno}.` : '')
}
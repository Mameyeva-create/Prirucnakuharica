
import { DATA_SOURCE } from "../../constants"
import ReceptServiceLocalStorage from "./ReceptServiceLocalStorage"
import ReceptServiceMemorija from "./ReceptServiceMemorija"
import ReceptServiceFirebase from "./ReceptServiceFirebase"



let Servis = null

switch (DATA_SOURCE.trim()) {
    case 'LocalStorage':
        Servis = ReceptServiceLocalStorage
        break

    case 'memorija':
        Servis = ReceptServiceMemorija
        break

    case 'firebase':
        Servis = ReceptServiceFirebase
        break

    default:
        console.error('Nepoznat DATA_SOURCE:', DATA_SOURCE)
}

const PrazanServis = {
    get: async () => ({ data: [] }),
    dodaj: async () => { console.log('Servis nije implementiran') },
    getById: async () => ({ data: null }),
    promijeni: async () => { console.error('Servis nije implementiran') },
    obrisi: async () => { console.error('Servis nije implementiran') },
}

const AktivniServis = Servis || PrazanServis

// Straničenje - dohvati stranicu recepata
async function dohvatiStranicu(stranica = 1, velicinaStranice = 10) {
    const recepti = await AktivniServis.get()
    const pocetniIndeks = (stranica - 1) * velicinaStranice
    const zavrsniIndeks = pocetniIndeks + velicinaStranice
    const stranicenjePodaci = recepti.data.slice(pocetniIndeks, zavrsniIndeks)
    const ukupnoStavki = recepti.data.length
    const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice)
    return {
        data: stranicenjePodaci, ukupnoStranica, ukupnoStavki
    }
}

export default {
    get: () => AktivniServis.get(),
    dodaj: (recept) => AktivniServis.dodaj(recept),
    getById: (id) => AktivniServis.getById(id),
    promijeni: (id, recept) => AktivniServis.promijeni(id, recept),
    obrisi: (id) => AktivniServis.obrisi(id),
    dohvatiStranicu

}
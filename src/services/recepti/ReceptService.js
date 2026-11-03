
import { DATA_SOURCE } from "../../constants"
import ReceptServiceLocalStorage from "./ReceptServiceLocalStorage"
import ReceptServiceMemorija from "./ReceptServiceMemorija"



let Servis = null

if (DATA_SOURCE.trim() === 'LocalStorage') {
    Servis = ReceptServiceLocalStorage
} else if (DATA_SOURCE.trim() === 'memorija') {
    Servis = ReceptServiceMemorija
} else {
    console.error('Nepoznat DATA_SOURCE:', DATA_SOURCE)
}

const PrazanServis = {
    get: async () => ({ data: [] }),
    dodaj: async (recept) => { console.log('Servis nije implementiran') },
    getById: async (id) => ({ data: {} }),
    promijeni: async (id, recept) => { console.error('Servis nije implementiran') },
    obrisi: async (id) => { console.error('Servis nije implementiran') },
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
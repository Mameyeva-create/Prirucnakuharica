// import { data } from "react-router-dom"
import { DATA_SOURCE } from "../../constants"
import KategorijaServiceLocalStorage from "./KategorijaServiceLocalStorage"
import KategorijaServiceMemorija from "./KategorijaServiceMemorija"



let Servis = null

if (DATA_SOURCE.trim() === 'LocalStorage') {
    Servis = KategorijaServiceLocalStorage
} else if (DATA_SOURCE.trim() === 'memorija') {
    Servis = KategorijaServiceMemorija
} else {
    console.error('Nepoznat DATA_SOURCE:', DATA_SOURCE)
}



const PrazanServis = {
    get: async () => ({ data: [] }),
    dodaj: async (Kategorija) => { console.log('Servis nije implementiran') },
    getById: async (id) => ({ data: {} }),
    promijeni: async (id, Kategorija) => { console.error('Servis nije implementiran') },
    obrisi: async (id) => { console.error('Servis nije implementiran') },
}

const AktivniServis = Servis || PrazanServis





export default {
    get: () => AktivniServis.get(),
    dodaj: (Kategorija) => AktivniServis.dodaj(Kategorija),
    getById: (id) => AktivniServis.getById(id),
    promijeni: (id, Kategorija) => AktivniServis.promijeni(id, Kategorija),
    obrisi: (id) => AktivniServis.obrisi(id)
}
// import { data } from "react-router-dom"
import { DATA_SOURCE } from "../../constants"
import JedinicaMjereServiceLocalStorage from "./JedinicaMjereServiceLocalStorage"
import JedinicaMjereServiceMemorija from "./JedinicaMjereServiceMemorija"



let Servis = null

if (DATA_SOURCE.trim() === 'LocalStorage') {
    Servis = JedinicaMjereServiceLocalStorage
} else if (DATA_SOURCE.trim() === 'memorija') {
    Servis = JedinicaMjereServiceMemorija
} else {
    console.error('Nepoznat DATA_SOURCE:', DATA_SOURCE)
}



const PrazanServis = {
    get: async () => ({ data: [] }),
    dodaj: async () => { console.log('Servis nije implementiran') },
    getById: async () => ({ data: {} }),
    promijeni: async () => { console.error('Servis nije implementiran') },
    obrisi: async () => { console.error('Servis nije implementiran') },
}

const AktivniServis = Servis || PrazanServis


export default {
    get: () => AktivniServis.get(),
    dodaj: (sastojak) => AktivniServis.dodaj(sastojak),
    getById: (id) => AktivniServis.getById(id),
    promijeni: (id, sastojak) => AktivniServis.promijeni(id, sastojak),
    obrisi: (id) => AktivniServis.obrisi(id)
}
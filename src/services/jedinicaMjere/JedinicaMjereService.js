// import { data } from "react-router-dom"
import { DATA_SOURCE } from "../../constants"
import JedinicaMjereServiceFirebase from "./JedinicaMjereServiceFirebase"
import JedinicaMjereServiceLocalStorage from "./JedinicaMjereServiceLocalStorage"
import JedinicaMjereServiceMemorija from "./JedinicaMjereServiceMemorija"



let Servis = null

switch (DATA_SOURCE.trim()) {
    case 'LocalStorage':
        Servis = JedinicaMjereServiceLocalStorage
        break

    case 'memorija':
        Servis = JedinicaMjereServiceMemorija
        break

    case 'firebase':
        Servis = JedinicaMjereServiceFirebase
        break

    default:
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
    promijeni: (id, jedinicaMjere) => AktivniServis.promijeni(id, jedinicaMjere),
    obrisi: (id) => AktivniServis.obrisi(id)
}
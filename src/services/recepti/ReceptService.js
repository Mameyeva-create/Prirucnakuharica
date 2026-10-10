// import { data } from "react-router-dom"
import { DATA_SOURCE } from "../../constants"
import ReceptServiceLocalStorage from "./ReceptServiceLocalStorage"
import ReceptServiceMemorija from "./ReceptServiceMemorija"



let Servis = null

// switch (DATA_SOURCE) {
//     case 'memorija':
//         Servis = ReceptServiceMemorija
//         break
//     case 'LocalStorage':
//         Servis = ReceptServiceLocalStorage
//         break
//     default:
//         Servis = null
// }

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





export default {
    get: () => AktivniServis.get(),
    dodaj: (recept) => AktivniServis.dodaj(recept),
    getById: (id) => AktivniServis.getById(id),
    promijeni: (id, recept) => AktivniServis.promijeni(id, recept),
    obrisi: (id) => AktivniServis.obrisi(id)
}
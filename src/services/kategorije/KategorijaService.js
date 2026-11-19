
import { DATA_SOURCE } from "../../constants"

import KategorijaServiceLocalStorage from "./KategorijaServiceLocalStorage"
import KategorijaServiceMemorija from "./KategorijaServiceMemorija"
import KategorijaServiceFirebase from "./KategorijaServiceFirebase"

let Servis = null

switch (DATA_SOURCE.trim()) {
    case "LocalStorage":
        Servis = KategorijaServiceLocalStorage
        break

    case "memorija":
        Servis = KategorijaServiceMemorija
        break

    case "firebase":
        Servis = KategorijaServiceFirebase
        break

    default:
        console.error("Nepoznat DATA_SOURCE:", DATA_SOURCE)
}

// ===================== FALLBACK =====================

const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getById: async () => ({ success: false, data: null }),
    dodaj: async () => ({ success: false, message: "Servis nije implementiran" }),
    promijeni: async () => ({ success: false, message: "Servis nije implementiran" }),
    obrisi: async () => ({ success: false, message: "Servis nije implementiran" })
}

const AktivniServis = Servis || PrazanServis

// ===================== EXPORT =====================

export default {
    get: () => AktivniServis.get(),
    dodaj: (kategorija) => AktivniServis.dodaj(kategorija),
    getById: (id) => AktivniServis.getById(id),
    promijeni: (id, kategorija) => AktivniServis.promijeni(id, kategorija),
    obrisi: (id) => AktivniServis.obrisi(id)
}

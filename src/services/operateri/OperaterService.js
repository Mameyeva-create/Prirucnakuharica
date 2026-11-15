import OperaterServiceLocalStorage from "./OperaterServiceLocalStorage"
import OperaterServiceMemorija from "./OperaterServiceMemorija"
import { DATA_SOURCE } from "../../constants"

let Servis = null

// 1. Odabir servisa
switch (DATA_SOURCE.trim()) {
    case 'memorija':
        Servis = OperaterServiceMemorija
        break
    case 'LocalStorage':
        Servis = OperaterServiceLocalStorage
        break;
    default:
        Servis = null
}

// 2. Definiranje defaultnog (praznog) ponašanja ako Servis nije pronađen
const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getById: async (id) => ({ success: false, data: null }),
    dodaj: async (operater) => { console.error("Servis nije učitan"); return {success: false} },
    promjeni: async (id, operater) => { console.error("Servis nije učitan"); return {success: false} },
    promjeniLozinku: async (id, novaLozinka) => { console.error("Servis nije učitan"); return {success: false} },
    obrisi: async (id) => { console.error("Servis nije učitan"); return {success: false} },
    prijava: async (email, lozinka) => { console.error("Servis nije učitan"); return {success: false, message: "Servis nije učitan"} }
}

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis

export default {
    get: () => AktivniServis.get(),
    getById: (id) => AktivniServis.getById(id),
    dodaj: (operater) => AktivniServis.dodaj(operater),
    promjeni: (id, operater) => AktivniServis.promjeni(id, operater),
    promjeniLozinku: (id, novaLozinka) => AktivniServis.promjeniLozinku(id, novaLozinka),
    obrisi: (id) => AktivniServis.obrisi(id),
    prijava: (email, lozinka) => AktivniServis.prijava(email, lozinka)
}

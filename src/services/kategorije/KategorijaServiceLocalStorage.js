import { PrefixStorage } from "../../constants"
import { kategorije as pocetneKategorije } from "./KategorijaPodaci"

// ===================== SORT =====================

// Za zapise bez polja redoslijed koristi se numerički ID, inače ide na kraj
function dohvatiRedoslijed(k) {
    if (typeof k.redoslijed === "number") return k.redoslijed

    const n = Number(k.id)
    return Number.isFinite(n) ? n : Infinity
}

function sortirajKategorije(kategorije) {
    return [...kategorije].sort((a, b) => {
        const ra = dohvatiRedoslijed(a)
        const rb = dohvatiRedoslijed(b)

        if (ra !== rb) return ra - rb

        return a.naziv?.localeCompare(b.naziv, "hr")
    })
}

// ===================== STORAGE =====================

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.KATEGORIJE, JSON.stringify(podaci))
}

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.KATEGORIJE)
    if (!podaci) return []

    try {
        return JSON.parse(podaci)
    } catch (error) {
        console.error('Greška pri čitanju kategorija:', error)
        return []
    }
}

// ===================== CRUD =====================

async function get() {
    return { success: true, data: sortirajKategorije(dohvatiSveIzStorage()) }
}

async function getById(id) {
    const kategorija = dohvatiSveIzStorage().find(i => String(i.id) === String(id))

    return kategorija
        ? { success: true, data: kategorija }
        : { success: false, data: null }
}

async function dodaj(kategorija) {
    const kategorije = dohvatiSveIzStorage()

    const noviId = kategorije.length === 0
        ? 1
        : Math.max(...kategorije.map(i => Number(i.id) || 0)) + 1

    // Nova kategorija ide na kraj popisa
    const najveciRedoslijed = kategorije.reduce((max, k) => {
        const r = dohvatiRedoslijed(k)
        return Math.max(max, Number.isFinite(r) ? r : 0)
    }, 0)

    const novaKategorija = {
        ...kategorija,
        id: noviId,
        redoslijed: kategorija.redoslijed ?? najveciRedoslijed + 1
    }

    kategorije.push(novaKategorija)
    spremiUStorage(kategorije)

    return { success: true, data: novaKategorija }
}

async function promijeni(id, kategorija) {
    const kategorije = dohvatiSveIzStorage()
    const index = kategorije.findIndex(i => String(i.id) === String(id))

    if (index === -1) {
        return { success: false, message: 'Kategorija ne postoji' }
    }

    kategorije[index] = { ...kategorije[index], ...kategorija, id: kategorije[index].id }
    spremiUStorage(kategorije)

    return { success: true, data: kategorije[index] }
}

async function obrisi(id) {
    const kategorije = dohvatiSveIzStorage()
    const ostalo = kategorije.filter(i => String(i.id) !== String(id))

    if (ostalo.length === kategorije.length) {
        return { success: false, message: 'Kategorija ne postoji' }
    }

    spremiUStorage(ostalo)
    return { success: true, message: 'Kategorija uspješno obrisana' }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
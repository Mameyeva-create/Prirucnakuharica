import { kategorije } from "./KategorijaPodaci"

// ===================== SORT =====================

// Za zapise bez polja redoslijed koristi se numerički ID, inače ide na kraj
function dohvatiRedoslijed(k) {
    if (typeof k.redoslijed === "number") return k.redoslijed

    const n = Number(k.id)
    return Number.isFinite(n) ? n : Infinity
}

function sortirajKategorije(popis) {
    return [...popis].sort((a, b) => {
        const ra = dohvatiRedoslijed(a)
        const rb = dohvatiRedoslijed(b)

        if (ra !== rb) return ra - rb

        return a.naziv?.localeCompare(b.naziv, "hr")
    })
}

function nadiIndex(id) {
    return kategorije.findIndex(i => String(i.id) === String(id))
}

// ===================== CRUD =====================

async function get() {
    return { success: true, data: sortirajKategorije(kategorije) }
}

async function getById(id) {
    const kategorija = kategorije[nadiIndex(id)]

    return kategorija
        ? { success: true, data: kategorija }
        : { success: false, data: null }
}

async function dodaj(kategorija) {
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

    return { success: true, data: novaKategorija }
}

async function promijeni(id, kategorija) {
    const index = nadiIndex(id)

    if (index === -1) {
        return { success: false, message: "Kategorija ne postoji" }
    }

    kategorije[index] = { ...kategorije[index], ...kategorija, id: kategorije[index].id }

    return { success: true, data: kategorije[index] }
}

async function obrisi(id) {
    const index = nadiIndex(id)

    if (index === -1) {
        return { success: false, message: "Kategorija ne postoji" }
    }

    kategorije.splice(index, 1)

    return { success: true, message: "Kategorija uspješno obrisana" }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
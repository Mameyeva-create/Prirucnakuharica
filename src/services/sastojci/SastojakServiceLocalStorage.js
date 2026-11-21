import { PrefixStorage } from "../../constants"

// ===================== SORT =====================

function sortirajSastojke(sastojci) {
    return [...sastojci].sort((a, b) =>
        a.naziv?.localeCompare(b.naziv, 'hr')
    )
}

// ===================== STORAGE =====================

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.SASTOJCI)
    if (!podaci) return []

    try {
        return JSON.parse(podaci)
    } catch (error) {
        console.error('Greška pri čitanju sastojaka:', error)
        return []
    }
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.SASTOJCI, JSON.stringify(podaci))
}

// ===================== CRUD =====================

async function get() {
    return { success: true, data: sortirajSastojke(dohvatiSveIzStorage()) }
}

async function getById(id) {
    const sastojak = dohvatiSveIzStorage().find(i => String(i.id) === String(id))

    return sastojak
        ? { success: true, data: sastojak }
        : { success: false, data: null }
}

async function dodaj(sastojak) {
    const sastojci = dohvatiSveIzStorage()

    const noviId = sastojci.length === 0
        ? 1
        : Math.max(...sastojci.map(i => Number(i.id) || 0)) + 1

    const noviSastojak = { ...sastojak, id: noviId }

    sastojci.push(noviSastojak)
    spremiUStorage(sastojci)

    return { success: true, data: noviSastojak }
}

async function promijeni(id, sastojak) {
    const sastojci = dohvatiSveIzStorage()
    const index = sastojci.findIndex(i => String(i.id) === String(id))

    if (index === -1) {
        return { success: false, message: 'Sastojak ne postoji' }
    }

    sastojci[index] = { ...sastojci[index], ...sastojak, id: sastojci[index].id }
    spremiUStorage(sastojci)

    return { success: true, data: sastojci[index] }
}

async function obrisi(id) {
    const sastojci = dohvatiSveIzStorage()
    const ostalo = sastojci.filter(i => String(i.id) !== String(id))

    if (ostalo.length === sastojci.length) {
        return { success: false, message: 'Sastojak ne postoji' }
    }

    spremiUStorage(ostalo)
    return { success: true, message: 'Sastojak uspješno obrisan' }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
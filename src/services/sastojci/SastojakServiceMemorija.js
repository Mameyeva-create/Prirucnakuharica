import { sastojci } from "./SastojakPodaci"

function sortirajSastojke(popis) {
    return [...popis].sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
}

function nadiIndex(id) {
    return sastojci.findIndex(i => String(i.id) === String(id))
}

async function get() {
    return { success: true, data: sortirajSastojke(sastojci) }
}

async function getById(id) {
    const sastojak = sastojci[nadiIndex(id)]

    return sastojak
        ? { success: true, data: sastojak }
        : { success: false, data: null }
}

async function dodaj(sastojak) {
    const noviSastojak = {
        ...sastojak,
        id: sastojci.length === 0
            ? 1
            : Math.max(...sastojci.map(i => Number(i.id) || 0)) + 1
    }
    sastojci.push(noviSastojak)

    return { success: true, data: noviSastojak }
}

async function promijeni(id, sastojak) {
    const index = nadiIndex(id)

    if (index === -1) {
        return { success: false, message: 'Sastojak ne postoji' }
    }

    sastojci[index] = { ...sastojci[index], ...sastojak, id: sastojci[index].id }

    return { success: true, data: sastojci[index] }
}

async function obrisi(id) {
    const index = nadiIndex(id)

    if (index === -1) {
        return { success: false, message: 'Sastojak ne postoji' }
    }

    sastojci.splice(index, 1)
    return { success: true, message: 'Sastojak uspješno obrisan' }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
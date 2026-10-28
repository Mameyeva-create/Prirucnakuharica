import { sastojci } from "./SastojakPodaci"

function sortirajSastojke(sastojci) {
    return [...sastojci].sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
}

async function get() {
    return { data: sortirajSastojke(sastojci)}
}

async function getById(id) {
    return { data: sastojci.find(i => i.id === parseInt(id, 10)) }
}

async function dodaj(sastojak) {
    const noviSastojak = {
        ...sastojak,
        id: sastojci.length === 0
            ? 1 : Math.max(...sastojci.map(i => i.id)) + 1
    }
    sastojci.push(noviSastojak)
    sastojci.sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
}

async function promijeni(id, sastojak) {
    const index = nadiIndex(id)
if (index === -1) {
    return
}
    sastojci[index] = { ...sastojci[index], ...sastojak }
    sastojci.sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
}

function nadiIndex(id) {
    return sastojci.findIndex(i => i.id === parseInt(id, 10))
}

async function obrisi(id) {
    const index = nadiIndex(id)
    if (index !== -1) {
 sastojci.splice(index, 1)
    }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
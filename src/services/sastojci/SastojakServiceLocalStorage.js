import { sastojci as pocetniSastojci } from "./SastojakPodaci"

const STORAGE_KEY = 'sastojci'

function sortirajSastojke(sastojci) {
    return [...sastojci].sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
}

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    if (podaci) {
        return JSON.parse(podaci)
    }
    spremiUStorage(pocetniSastojci)
    return [...pocetniSastojci]
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
    const sastojci = dohvatiSveIzStorage()
    return { data: sortirajSastojke(sastojci)}
}

async function getById(id) {
    const sastojci = dohvatiSveIzStorage()

    const sastojak = sastojci.find(i => i.id === parseInt(id, 10))

    return { data: sastojak }
}

async function dodaj(sastojak) {
    const sastojci = dohvatiSveIzStorage()

    const noviSastojak = {
        ...sastojak,
        id: sastojci.length === 0
            ? 1
            : Math.max(...sastojci.map(i => i.id)) + 1
    }

    sastojci.push(noviSastojak)
    spremiUStorage(sortirajSastojke(sastojci))

}

async function promijeni(id, sastojak) {
    const sastojci = dohvatiSveIzStorage()
    const index = sastojci.findIndex(i => i.id === parseInt(id, 10))
    if (index === -1) {
        return
    }
    sastojci[index] = { ...sastojci[index], ...sastojak }
    spremiUStorage(sortirajSastojke(sastojci))
}

async function obrisi(id) {
    let sastojci = dohvatiSveIzStorage()
    sastojci = sastojci.filter(i => i.id !== parseInt(id, 10))
    spremiUStorage(sastojci)
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
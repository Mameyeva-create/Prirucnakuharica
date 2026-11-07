import { kategorije } from "./KategorijaPodaci"


const STORAGE_KEY = 'kategorije'

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)

    if (podaci === null) {
        spremiUStorage(kategorije)
        return [...kategorije]
    }
    return JSON.parse(podaci)
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
    const kategorije = dohvatiSveIzStorage()
    return { data: [...kategorije] }
}

async function getById(id) {
    const kategorije = dohvatiSveIzStorage()
    const kategorija = kategorije.find(i => i.id === parseInt(id, 10))
    return { data: kategorija }
}

async function dodaj(kategorija) {
    const kategorije = dohvatiSveIzStorage()
    const novaKategorija = {
        ...kategorija, slikaPutanja: kategorija.slikaPutanja || "",
        id: kategorije.length === 0
            ? 1
            : Math.max(...kategorije.map(i => i.id)) + 1
    }

    kategorije.push(novaKategorija)
    spremiUStorage(kategorije)

}

async function promijeni(id, kategorija) {
    const kategorije = dohvatiSveIzStorage()
    const index = kategorije.findIndex(i => i.id === parseInt(id, 10))
    if (index === -1) return
    kategorije[index] = { ...kategorije[index], ...kategorija }
    spremiUStorage(kategorije)
}

async function obrisi(id) {
    let kategorije = dohvatiSveIzStorage()
    kategorije = kategorije.filter(i => i.id !== parseInt(id, 10))
    spremiUStorage(kategorije)
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
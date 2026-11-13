import { kategorije as pocetneKategorije } from "./KategorijaPodaci"


const STORAGE_KEY = 'kategorije'

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    // Первый запуск: ключа ещё нет, засеваем стартовые категории (ID 1-4)
    if (podaci === null) {
        const pocetne = pocetneKategorije.map(k => ({ ...k }))
        spremiUStorage(pocetne)
        return pocetne
    }
    try {
        return JSON.parse(podaci)
    } catch (error) {
        console.error('Greška pri čitanju kategorija:', error)
        return []
    }
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
        ...kategorija,
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
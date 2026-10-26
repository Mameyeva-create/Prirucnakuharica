const STORAGE_KEY = 'jediniceMjere'

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
    const jedinicaMjere = dohvatiSveIzStorage()
    return { data: [...jedinicaMjere] }
}

async function getById(id) {
    const jedinicaMjere = dohvatiSveIzStorage()

    const sastojak = jedinicaMjere.find(i => i.id === parseInt(id, 10))

    return { data: sastojak }
}

async function dodaj(sastojak) {
    const jedinicaMjere = dohvatiSveIzStorage()

    const noviJedinicaMjere = {
        ...sastojak,
        id: jedinicaMjere.length === 0
            ? 1
            : Math.max(...jedinicaMjere.map(i => i.id)) + 1
    }

    jedinicaMjere.push(noviJedinicaMjere)
    spremiUStorage(jedinicaMjere)

}

async function promijeni(id, sastojak) {
    const jedinicaMjere = dohvatiSveIzStorage()
    const index = jedinicaMjere.findIndex(i => i.id === parseInt(id, 10))
    if (index === -1) {
        return
    }
    jedinicaMjere[index] = { ...jedinicaMjere[index], ...sastojak }
    spremiUStorage(jedinicaMjere)
}

async function obrisi(id) {
    let jedinicaMjere = dohvatiSveIzStorage()
    jedinicaMjere = jedinicaMjere.filter(i => i.id !== parseInt(id, 10))
    spremiUStorage(jedinicaMjere)
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
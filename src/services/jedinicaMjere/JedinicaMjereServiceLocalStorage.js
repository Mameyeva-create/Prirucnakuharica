import { PrefixStorage } from "../../constants"

function sortirajJedinice(jedinice) {
    return [...jedinice].sort((a, b) =>
        a.naziv?.localeCompare(b.naziv, 'hr'))
}

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.JEDINICE_MJERE)
    if (!podaci) return []
    try {
        return JSON.parse(podaci)
    } catch (error) {
        console.error('Greška pri čitanju jedinica mjere:', error)
        return []
    }
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.JEDINICE_MJERE, JSON.stringify(podaci))
}

async function get() {
    const jedinicaMjere = dohvatiSveIzStorage()
    return { data: sortirajJedinice(jedinicaMjere) }
}

async function getById(id) {
    const jediniceMjera = dohvatiSveIzStorage()

    const jedinicaMjere = jediniceMjera.find(i => i.id === parseInt(id, 10))

    return { data: jedinicaMjere }
}

async function dodaj(jedinicaMjere) {
    const jediniceMjera = dohvatiSveIzStorage()

    const noviJedinicaMjere = {
        ...jedinicaMjere,
        id: jediniceMjera.length === 0
            ? 1
            : Math.max(...jediniceMjera?.map(i => i.id)) + 1
    }

    jediniceMjera.push(noviJedinicaMjere)
    spremiUStorage(jediniceMjera)

}

async function promijeni(id, jedinicaMjere) {
    const jedinicaMjera = dohvatiSveIzStorage()
    const index = jedinicaMjera.findIndex(i => i.id === parseInt(id, 10))
    if (index === -1) {
        return
    }
    jedinicaMjera[index] = { ...jedinicaMjera[index], ...jedinicaMjere }
    spremiUStorage(sortirajJedinice(jedinicaMjera))
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
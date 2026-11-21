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
    return { success: true, data: sortirajJedinice(dohvatiSveIzStorage()) }
}

async function getById(id) {
    const jedinica = dohvatiSveIzStorage().find(i => String(i.id) === String(id))
    return jedinica
        ? { success: true, data: jedinica }
        : { success: false, data: null }
}
async function dodaj(jedinicaMjere) {
    const jediniceMjera = dohvatiSveIzStorage()

    const noviId = jediniceMjera.length === 0
        ? 1
        : Math.max(...jediniceMjera.map(i => Number(i.id) || 0)) + 1

    const novaJedinicaMjere = { ...jedinicaMjere, id: noviId }

    jediniceMjera.push(novaJedinicaMjere)
    spremiUStorage(jediniceMjera)

    return { success: true, data: novaJedinicaMjere }
}

async function promijeni(id, jedinicaMjere) {
    const sve = dohvatiSveIzStorage()
    const index = sve.findIndex(i => String(i.id) === String(id))

    if (index === -1) {
        return { success: false, message: 'Jedinica mjere ne postoji' }
    }

    sve[index] = { ...sve[index], ...jedinicaMjere, id: sve[index].id }
    spremiUStorage(sve)

    return { success: true, data: sve[index] }
}

async function obrisi(id) {
    const sve = dohvatiSveIzStorage()
    const ostalo = sve.filter(i => String(i.id) !== String(id))

    if (ostalo.length === sve.length) {
        return { success: false, message: 'Jedinica mjere ne postoji' }
    }

    spremiUStorage(ostalo)
    return { success: true, message: 'Jedinica mjere uspješno obrisana' }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
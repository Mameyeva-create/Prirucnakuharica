import { jediniceMjere } from "./JedinicaMjerePodaci"

function sortirajJedinice(jedinice) {
    return [...jedinice].sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
}

function nadiIndex(id) {
    return jediniceMjere.findIndex(i => String(i.id) === String(id))
}

async function get() {
    return { success: true, data: sortirajJedinice(jediniceMjere) }
}

async function getById(id) {
    const jedinica = jediniceMjere[nadiIndex(id)]
    return jedinica
        ? { success: true, data: jedinica }
        : { success: false, data: null }
}

async function dodaj(jedinicaMjere) {
    const novaJedinica = {
        ...jedinicaMjere,
        id: jediniceMjere.length === 0
            ? 1
            : Math.max(...jediniceMjere.map(i => Number(i.id) || 0)) + 1
    }
    jediniceMjere.push(novaJedinica)

    return { success: true, data: novaJedinica }
}

async function promijeni(id, jedinicaMjere) {
    const index = nadiIndex(id)
    if (index === -1) {
        return { success: false, message: 'Jedinica mjere ne postoji' }
    }

    jediniceMjere[index] = { ...jediniceMjere[index], ...jedinicaMjere, id: jediniceMjere[index].id }

    return { success: true, data: jediniceMjere[index] }
}

async function obrisi(id) {
    const index = nadiIndex(id)
    if (index === -1) {
        return { success: false, message: 'Jedinica mjere ne postoji' }
    }

    jediniceMjere.splice(index, 1)
    return { success: true, message: 'Jedinica mjere uspješno obrisana' }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
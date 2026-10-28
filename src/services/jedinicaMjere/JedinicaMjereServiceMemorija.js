import { jediniceMjere } from "./JedinicaMjerePodaci"

function sortirajJedinice(jedinice) {
    return [...jedinice].sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
}

async function get() {
    return { data: sortirajJedinice(jediniceMjere)}
}

async function getById(id) {
    return { data: jediniceMjere.find(i => i.id === parseInt(id, 10)) }
}

async function dodaj(jedinicaMjere) {
    const novaJedinica = {
        ...jedinicaMjere,
        id: jediniceMjere.length === 0
            ? 1 : Math.max(...jediniceMjere.map(i => i.id)) + 1
    }
    jediniceMjere.push(novaJedinica)
    jediniceMjere.sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
}

async function promijeni(id, jedinicaMjere) {
    const index = nadiIndex(id)
if (index === -1) {
    return
}
    jediniceMjere[index] = { ...jediniceMjere[index], ...jedinicaMjere }
}
jediniceMjere.sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))

function nadiIndex(id) {
    return jediniceMjere.findIndex(i => i.id === parseInt(id, 10))
}

async function obrisi(id) {
    const index = nadiIndex(id)
    if (index !== -1) {
 jediniceMjere.splice(index, 1)
    }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
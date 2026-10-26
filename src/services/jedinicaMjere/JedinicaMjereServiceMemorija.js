import { jediniceMjere } from "./JedinicaMjerePodaci"

async function get() {
    return { data: [...jediniceMjere] }
}

async function getById(id) {
    return { data: jediniceMjere.find(i => i.id === parseInt(id, 10)) }
}

async function dodaj(jedinicaMjere) {
    const noviSastojak = {
        ...jedinicaMjere,
        id: jediniceMjere.length === 0
            ? 1 : Math.max(...jediniceMjere.map(i => i.id)) + 1
    }
    jediniceMjere.push(noviSastojak)
}

async function promijeni(id, jedinicaMjere) {
    const index = nadiIndex(id)
if (index === -1) {
    return
}
    jediniceMjere[index] = { ...jediniceMjere[index], ...jedinicaMjere }
}

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
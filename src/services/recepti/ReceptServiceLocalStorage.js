


const STORAGE_KEY = 'recepti'

// Dohvaća sve recepte iz LocalStoragea
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    if (!podaci) {
        return []
    }
    try {
        return JSON.parse(podaci)
    } catch (error) {
        console.error('Greška pri čitanju recepata:', error)
        return []
    }
}
// Sprema recepte u LocalStorage
function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}
// Dohvaća sve recepte
async function get() {
    return { data: dohvatiSveIzStorage() }
}
// Dohvaća jedan recept prema ID-u
async function getById(id) {
    const recepti = dohvatiSveIzStorage()
    const recept = recepti.find(r => r.id === Number(id))
    return { data: recept || null }
}

// Dodaje novi recept
async function dodaj(recept) {
    const recepti = dohvatiSveIzStorage()

    const noviId = recepti.length === 0 ? 1
        : Math.max(...recepti.map(r => Number(r.id) || 0)) + 1

    const noviRecept = {
        ...recept, id: noviId, slikaPutanja: recept.slikaPutanja || ""
    }

    recepti.push(noviRecept)
    spremiUStorage(recepti)
    return { data: noviRecept }
}
// Mijenja postojeći recept
async function promijeni(id, recept) {
    const recepti = dohvatiSveIzStorage()
    const index = recepti.findIndex(r => r.id === Number(id))

    if (index === -1) {
        throw new Error('Recept nije pronađen.');
    }
    recepti[index] = { ...recepti[index], ...recept, id: recepti[index].id }

    spremiUStorage(recepti)
    return { data: recepti[index] }
}
// Briše jedan recept prema ID-u
async function obrisi(id) {
    const recepti = dohvatiSveIzStorage()
    const noviRecepti = recepti.filter(r => r.id !== Number(id))
    spremiUStorage(noviRecepti)
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}



const STORAGE_KEY = 'recepti'

// Dohvaća sve recepte iz LocalStoragea
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
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
    const trazeniId = Number(id)

    const slikePoId = {
        1: "/src/assets/slike/carbonara.jpg",
        2: "/src/assets/slike/palacinke.jpg",
        3: "/src/assets/slike/piletina.jpg",
        4: "/src/assets/slike/pizza.jpg",
        5: "/src/assets/slike/cezar-salata.jpg",
        6: "/src/assets/slike/cokoladni-kolac.jpg",
        7: "/src/assets/slike/povrtna-juha.jpg"
    }

    const recept = recepti.find(r => r.id === trazeniId)

    if (!recept) {
        return { data: null }
    }
    return {
        data: {
            ...recept, slikaPutanja: recept.slikaPutanja || slikePoId[recept.id] || ''
        }
    }
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
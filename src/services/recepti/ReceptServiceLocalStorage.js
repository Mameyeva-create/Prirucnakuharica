import { data } from "react-router-dom"

const STORAGE_KEY = 'recepti'

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get() {
    const recepti = dohvatiSveIzStorage()
    return { data: [...recepti] }
}

async function getById(id) {
    const recepti = dohvatiSveIzStorage()

    const slikePoId = {
        1: "/src/assets/slike/carbonara.jpg",
        2: "/src/assets/slike/palacinke.jpg",
        3: "/src/assets/slike/piletina.jpg",
        4: "/src/assets/slike/pizza.jpg",
        5: "/src/assets/slike/cezar-salata.jpg",
        6: "/src/assets/slike/cokoladni-kolac.jpg",
        7: "/src/assets/slike/povrtna-juha.jpg"
    }

    const recept = recepti.find(i => i.id === parseInt(id, 10))

    if (!recept) {
        return {data: null}
    }

    if (!recept.slikaPutanja && slikePoId[recept.id]) {
        recept.slikaPutanja = slikePoId[recept.id]
    }

    return { data: recept }
}

async function dodaj(recept) {
    const recepti = dohvatiSveIzStorage()

    const noviRecept = {
        ...recept, slikaPutanja: recept.slikaPutanja || "",
        id: recepti.length === 0
            ? 1
            : Math.max(...recepti.map(i => i.id)) + 1
    }

    recepti.push(noviRecept)
    spremiUStorage(recepti)

}

async function promijeni(id, recept) {
    const recepti = dohvatiSveIzStorage()
    const index = recepti.findIndex(i => i.id === parseInt(id))
    recepti[index] = { ...recepti[index], ...recept }
    spremiUStorage(recepti)
}

async function obrisi(id) {
    let recepti = dohvatiSveIzStorage()
    recepti = recepti.filter(i => i.id !== parseInt(id))
    spremiUStorage(recepti)
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
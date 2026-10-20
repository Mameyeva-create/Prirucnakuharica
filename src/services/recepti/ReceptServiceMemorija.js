
import { data } from "react-router-dom"
import { recepti } from "./ReceptPodaci"

async function get() {
    return { data: [...recepti] }
}

async function getById(id) {
    return { data: recepti.find(i => i.id === Number(id)) }
}

async function dodaj(recept) {
    const noviId = recepti.length === 0
        ? 1
        : Math.max(...recepti.map(i => Number(i.id) || 0)) + 1

    const noviRecept = { ...recept, id: noviId }

    recepti.push(noviRecept)
    return { data: noviRecept }
}


async function promijeni(id, recept) {
    const index = nadiIndex(id)
    if (index === -1) {
        throw new Error("Recept nije pronađen, ID: " + id);
    }
    recepti[index] = { ...recepti[index], ...recept, id: Number(id) }

    return { data: recepti[index] }
}
function nadiIndex(id) {
    return recepti.findIndex(i => i.id === Number(id))
}

async function obrisi(id) {
    const index = nadiIndex(id)

    if (index !== -1) {
        recepti.splice(index, 1)
    }
}
export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
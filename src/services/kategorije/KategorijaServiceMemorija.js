import { kategorije } from "./KategorijaPodaci"

async function get() {
    return {data: [...kategorije]}
}

async function getById(id) {
    return {data: kategorije.find(i => i.id === parseInt(id))}
}

async function dodaj (kategorija) {
    if(kategorije.length === 0) {
        kategorija.id = 1
    } else {
        kategorija.id = kategorije[kategorije.length - 1].id + 1
    }
    kategorije.push(kategorija)
}

async function promijeni(id,kategorija) {
    const index = nadiIndex(id)
    kategorije[index] = {...kategorije[index], ...kategorija}
}

function nadiIndex(id) {
    return kategorije.findIndex(i => i.id === parseInt(id))
}

async function obrisi(id) {
    const index = nadiIndex(id)
    kategorije.splice(index,1)
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    obrisi
}
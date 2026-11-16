import { success } from "zod"
import { operateri } from "./OperaterPodaci"
import bcrypt from 'bcryptjs'

// 1/4 Read od CRUD
async function get() {
    // Ne vraćamo lozinke u listi
    const operateriBezcLozinki = operateri.map(op => ({
        id: op.id,
        ime: op.ime,
        prezime: op.prezime,
        email: op.email,
        uloga: op.uloga,
        generirano: op.generirano
    }))
    return { success: true, data: [...operateriBezcLozinki] }
}

async function getById(id) {
    const operater = operateri.find(o => o.id === id)
    if (!operater) {
        return { success: false, data: null }
    }
    // Ne vraćamo lozinku
    return {
        success: true, data: {
            id: operater.id,
            ime: operater.ime,
            prezime: operater.prezime,
            email: operater.email,
            uloga: operater.uloga
        }
    }
}

// 2/4 Create od CRUD
async function dodaj(operater) {
    // Provjera postoji li već isti email
    const email = operater.email.trim().toLowerCase()
    const postojiEmail = operateri.some(
        op => op.email.toLowerCase()
    )
    if (postojiEmail) {
        return {
            success: false,
            message: 'Operater s ovim emailom već postoji'
        }
    }
    // Određivanje novog ID-a
    const najveciId = operateri.reduce(
        (max, op) => Math.max(max, Number(op.id) || 0),
        0
    )
    const noviOperater = {
        ...operater,
        id: String(najveciId + 1),
        email: email,
        uloga: 'korisnik',
        lozinka: bcrypt.hashSync(operater.lozinka, 10)
        // operater.id = String(najveciId + 1)
    }
    operateri.push(noviOperater)
    return { success: true, data: { id: noviOperater.id, email: noviOperater.email, uloga: noviOperater.uloga } }
}

// 3/4 Update od CRUD
async function promjeni(id, operater) {
    const index = nadiIndex(id)
    if (index === -1) {
        return { success: false, message: "Operater nije pronađen" }
    }

    // Ažuriraj email i ulogu, ne lozinku
    operateri[index] = {
        ...operateri[index],
        email: operater.email,
        uloga: operater.uloga,
        id: id
    }

    return { success: true, data: { id: operateri[index].id, email: operateri[index].email, uloga: operateri[index].uloga } }
}

// Posebna funkcija za promjenu lozinke
async function promjeniLozinku(id, novaLozinka) {
    const index = nadiIndex(id)
    if (index === -1) {
        return { success: false, message: "Operater nije pronađen" }
    }

    // Hashiraj novu lozinku
    operateri[index].lozinka = bcrypt.hashSync(novaLozinka, 10)

    return { success: true, message: "Lozinka uspješno promijenjena" }
}

function nadiIndex(id) {
    return operateri.findIndex(o => o.id === id)
}

// 4/4 Delete od CRUD
async function obrisi(id) {
    const index = nadiIndex(id)
    if (index > -1) {
        operateri.splice(index, 1)
        return { success: true, message: "Operater obrisan" }
    }
    return { success: false, message: "Operater nije pronađen" }
}

// Funkcija za prijavu
async function prijava(email, lozinka) {
    const trazeniEmail = email.trim().toLowerCase()
    const operater = operateri.find(o => o.email.toLocaleLowerCase() === trazeniEmail)
    if (!operater) {
        return { success: false, message: "Email i lozinka ne odgovaraju" } // iako bi ovdje mogli napisati i da email ne postoji ali to onda napadačima omogućuje da zna tko je a tko nije registriran
    }
    // Provjeri lozinku pomoću bcrypt
    const isMatch = bcrypt.compareSync(lozinka, operater.lozinka)
    if (!isMatch) {
        return { success: false, message: "Email i lozinka ne odgovaraju" }
    }

    // Vrati operatere bez lozinke
    return {
        success: true,
        data: {
            id: operater.id,
            ime: operater.ime,
            prezime: operater.prezime,
            email: operater.email,
            uloga: operater.uloga
        }
    }
}

export default {
    get,
    dodaj,
    getById,
    promjeni,
    promjeniLozinku,
    obrisi,
    prijava
}

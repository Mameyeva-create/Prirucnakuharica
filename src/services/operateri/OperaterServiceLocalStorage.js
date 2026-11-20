import bcrypt from 'bcryptjs'
import { operateri as pocetniOperateri } from './OperaterPodaci'
import { PrefixStorage } from '../../constants'

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.OPERATERI, JSON.stringify(podaci))
}

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.OPERATERI)
    // Prvo pokretanje: ključa još nema, upisujemo početne operatere
    if (podaci === null) {
        const pocetni = pocetniOperateri.map(o => ({ ...o }))
        spremiUStorage(pocetni)
        return pocetni
    }
    try {
        return JSON.parse(podaci)
    } catch (error) {
        console.error('Greška pri čitanju operatera:', error)
        return []
    }
}

// 1/4 Read - dohvati sve
async function get() {
    const operateri = dohvatiSveIzStorage()
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

// Dohvati jedan po šifri
async function getById(id) {
    const operateri = dohvatiSveIzStorage()
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

// 2/4 Create - dodaj novi
async function dodaj(operater) {
    const operateri = dohvatiSveIzStorage()
    const email = operater.email.trim().toLowerCase()
    const postojiEmail = operateri.some(
        op => op.email.toLowerCase() === email
    )
    if (postojiEmail) {
        return {
            success: false,
            message: "Operater s ovim emailom već postoji"
        }
    }
    // Pronalaženje najveće šifre da izbjegnemo duplikate
    const najveciId = operateri.reduce(
        (max, op) => Math.max(max, Number(op.id) || 0),
        0
    )
    // Hashiranje lozinke
    const noviOperater = {
        ...operater,
        id: String(najveciId + 1),
        email: email,
        uloga: 'korisnik',
        lozinka: bcrypt.hashSync(operater.lozinka, 10)
    }
    operateri.push(noviOperater)
    spremiUStorage(operateri)
    return { success: true, data: { id: noviOperater.id, email: noviOperater.email, uloga: noviOperater.uloga } }
}

// 3/4 Update - promijeni postojeći
async function promijeni(id, operater) {
    const operateri = dohvatiSveIzStorage()
    const index = operateri.findIndex(o => o.id === id)

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
    spremiUStorage(operateri)
    return { success: true, data: { id: operateri[index].id, email: operateri[index].email, uloga: operateri[index].uloga } }
}

// Posebna funkcija za promjenu lozinke
async function promijeniLozinku(id, novaLozinka) {
    const operateri = dohvatiSveIzStorage()
    const index = operateri.findIndex(o => o.id === id)

    if (index === -1) {
        return { success: false, message: "Operater nije pronađen" }
    }

    // Hashiraj novu lozinku
    operateri[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    spremiUStorage(operateri)

    return { success: true, message: "Lozinka uspješno promijenjena" }
}

// 4/4 Delete - obriši
async function obrisi(id) {
    let operateri = dohvatiSveIzStorage()
    const initialLength = operateri.length
    operateri = operateri.filter(o => o.id !== id)

    if (operateri.length === initialLength) {
        return { success: false, message: "Operater nije pronađen" }
    }

    spremiUStorage(operateri)
    return { success: true, message: 'Operater obrisan' }
}

// Funkcija za prijavu
async function prijava(email, lozinka) {
    const operateri = dohvatiSveIzStorage()
    const trazeniEmail = email.trim().toLowerCase()
    const operater = operateri.find(o => o.email.toLowerCase() === trazeniEmail)
    if (!operater) {
        return { success: false, message: "Email i lozinka ne odgovaraju" } // iako bi ovdje mogli napisati i da email ne postoji ali to onda napadačima omogućuje da zna tko je a tko nije registriran
    }

    // Provjeri lozinku pomoću bcrypt
    const isMatch = bcrypt.compareSync(lozinka, operater.lozinka)
    if (!isMatch) {
        return { success: false, message: "Email i lozinka ne odgovaraju" }
    }

    // Vrati operatera bez lozinke
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
    promijeni,
    promijeniLozinku,
    obrisi,
    prijava
}
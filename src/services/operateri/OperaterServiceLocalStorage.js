import bcrypt from 'bcryptjs'
import { PrefixStorage } from '../../constants'

// ===================== STORAGE =====================
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.OPERATERI)
    if (!podaci) return []

    try {
        return JSON.parse(podaci)
    } catch (error) {
        console.error('Greška pri čitanju operatera:', error)
        return []
    }
}
function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.OPERATERI, JSON.stringify(podaci))
}
// Operater bez lozinke (za vraćanje prema van)
function bezLozinke(op) {
    const { lozinka, ...ostatak } = op
    return ostatak
}
// ===================== CRUD =====================
async function get() {
    return { success: true, data: dohvatiSveIzStorage().map(bezLozinke) }
}
async function getById(id) {
    const operater = dohvatiSveIzStorage().find(o => String(o.id) === String(id))
    return operater
        ? { success: true, data: bezLozinke(operater) }
        : { success: false, data: null }
}
async function dodaj(operater) {
    const operateri = dohvatiSveIzStorage()
    const email = operater.email.trim().toLowerCase()

    if (operateri.some(o => o.email.toLowerCase() === email)) {
        return { success: false, message: 'Operater s ovim emailom već postoji' }
    }
    const noviId = operateri.length === 0
        ? 1
        : Math.max(...operateri.map(o => Number(o.id) || 0)) + 1

    const noviOperater = {
        ...operater,
        id: String(noviId),
        email,
        uloga: operater.uloga || 'korisnik',
        lozinka: bcrypt.hashSync(operater.lozinka, 10)
    }
    operateri.push(noviOperater)
    spremiUStorage(operateri)

    return {
        success: true,
        data: { id: noviOperater.id, email, uloga: noviOperater.uloga }
    }
}
async function promijeni(id, operater) {
    const operateri = dohvatiSveIzStorage()
    const index = operateri.findIndex(o => String(o.id) === String(id))

    if (index === -1) {
        return { success: false, message: 'Operater nije pronađen' }
    }

    operateri[index] = {
        ...operateri[index],
        email: operater.email ?? operateri[index].email,
        uloga: operater.uloga ?? operateri[index].uloga,
        id: operateri[index].id
    }
    spremiUStorage(operateri)

    return { success: true, data: bezLozinke(operateri[index]) }
}
async function promijeniLozinku(id, novaLozinka) {
    const operateri = dohvatiSveIzStorage()
    const index = operateri.findIndex(o => String(o.id) === String(id))

    if (index === -1) {
        return { success: false, message: "Operater nije pronađen" }
    }
    // Hashiraj novu lozinku
    operateri[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    spremiUStorage(operateri)

    return { success: true, message: "Lozinka uspješno promijenjena" }
}
async function obrisi(id) {
    const operateri = dohvatiSveIzStorage()
    const ostalo = operateri.filter(o => String(o.id) !== String(id))

    if (ostalo.length === operateri.length) {
        return { success: false, message: 'Operater nije pronađen' }
    }

    spremiUStorage(ostalo)
    return { success: true, message: 'Operater obrisan' }
}

async function prijava(email, lozinka) {
    const poruka = 'Email i lozinka ne odgovaraju'
    const trazeni = email.trim().toLowerCase()

    const operater = dohvatiSveIzStorage().find(o => o.email.toLowerCase() === trazeni)
    if (!operater || !bcrypt.compareSync(lozinka, operater.lozinka)) {
        return { success: false, message: poruka }
    }

    return { success: true, data: bezLozinke(operater) }
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
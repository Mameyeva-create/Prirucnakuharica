import { data } from "react-router-dom"

const STORAGE_KEY = 'recepti'

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    return podaci ? JSON.parse(podaci) : []
}

function spremiUStorage(podaci){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

async function get () {
    const recepti = dohvatiSveIzStorage()
    return { data: [...recepti] }
}

async function getById(id) {
    const recepti = dohvatiSveIzStorage()
    const recept = recepti.find(i => i.id === parseInt(id))
    return {data: recept}
}

async function dodaj(recept) {
    const recepti = dohvatiSveIzStorage()
    if (recepti.length === 0) {
        recept.id = 1
    } else {
        const maxId = Math.max(...recepti.map(i => i.id))
        recept.id = maxId + 1
    } 
    recepti.push(recept)
    spremiUStorage(recepti)
        
}

async function promijeni(id, recept) {
    const recepti = dohvatiSveIzStorage()
    const index = recepti.findIndex(i => i.id === parseInt(id))
    recepti[index] = {...recepti[index], ...recept}
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
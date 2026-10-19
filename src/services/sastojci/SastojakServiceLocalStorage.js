
import Sastojak from "../../models/Sastojak"

const STORAGE_KEY = 'sastojci'

class SastojakServiceLocalStorage {
    get() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    }
    getById(id) {
        return this.get().find(
            (sastojak) => sastojak.id === Number(id)
        )
    }
    dodaj(naziv) {
        const nazivUredjen = naziv.trim()

        if (!nazivUredjen) {
            throw new Error('Unesi naziv sastojka')
        }

        const sastojci = this.get()

        const postoji = sastojci.some(
            (sastojak) => sastojak.naziv.toLocaleLowerCase('hr') ===
                nazivUredjen.toLocaleLowerCase('hr')
        )
        if (postoji) {
            throw new Error('Ovaj sastojak već postoji')
        }
        const id = sastojci.reduce(
            (najveci, sastojak) => Math.max(najveci, sastojak.id),
            0
        ) + 1

        const noviSastojak = new Sastojak(
            id,
            nazivUredjen
        )
        sastojci.push(noviSastojak)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sastojci))
        return noviSastojak
    }

    promijeni(id, naziv) {
        const nazivUredjen = naziv.trim()

        if (!nazivUredjen) {
            throw new Error('Unesi naziv sastojka')
        }

        const sastojci = this.get()
        const trazeniid = Number(id)

        const postojiId = sastojci.some(
            (sastojak) => sastojak.id === trazeniid
        )

        if (!postojiId) {
            throw new Error("Sastojak nije pronađen");
        }
        const duplikat = sastojci.some(
            (sastojak) => sastojak.id !== trazeniid &&
                sastojak.naziv.toLocaleLowerCase('hr') ===
                nazivUredjen.toLocaleLowerCase('hr')
        )
        if (duplikat) {
            throw new Error("Ovaj sastojak već postoji");
        }
        const azurirani = sastojci.map((sastojak) =>
            sastojak.id === trazeniid
                ? { ...sastojak, naziv: nazivUredjen }
                : sastojak
        )
        localStorage.setItem(STORAGE_KEY, JSON.stringify(azurirani))
        return this.getById(trazeniid)
    }
}

export default new SastojakServiceLocalStorage()
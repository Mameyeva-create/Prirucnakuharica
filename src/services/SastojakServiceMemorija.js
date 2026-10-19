
import Sastojak from "../models/Sastojak"

let sastojci = []

class SastojakServiceMemorija {
    get() {
        return sastojci.map((sastojak) => ({ ...sastojak }))
    }

    getById(id) {
        const sastojak = sastojci.find(
            (sastojak) => sastojak.id === Number(id)
        )

        return sastojak ? { ...sastojak } : undefined
    }

    dodaj(naziv) {
        const nazivUredjen = naziv.trim()

        if (!nazivUredjen) {
            throw new Error("Unesi naziv sastojka")
        }

        const postoji = sastojci.some(
            (sastojak) =>
                sastojak.naziv.toLocaleLowerCase("hr") ===
                nazivUredjen.toLocaleLowerCase("hr")
        )

        if (postoji) {
            throw new Error("Ovaj sastojak već postoji")
        }

        const id = sastojci.reduce(
            (najveci, sastojak) => Math.max(najveci, sastojak.id),
            0
        ) + 1

        const noviSastojak = new Sastojak(id, nazivUredjen)

        sastojci.push(noviSastojak)

        return { ...noviSastojak }
    }

    promijeni(id, naziv) {
        const nazivUredjen = naziv.trim()
        const trazeniId = Number(id)

        if (!nazivUredjen) {
            throw new Error("Unesi naziv sastojka")
        }

        const postojiId = sastojci.some(
            (sastojak) => sastojak.id === trazeniId
        )

        if (!postojiId) {
            throw new Error("Sastojak nije pronađen")
        }

        const duplikat = sastojci.some(
            (sastojak) =>
                sastojak.id !== trazeniId &&
                sastojak.naziv.toLocaleLowerCase("hr") ===
                nazivUredjen.toLocaleLowerCase("hr")
        )

        if (duplikat) {
            throw new Error("Ovaj sastojak već postoji")
        }

        sastojci = sastojci.map((sastojak) =>
            sastojak.id === trazeniId
                ? { ...sastojak, naziv: nazivUredjen }
                : sastojak
        )

        return this.getById(trazeniId)
    }

    obrisi(id) {
        const trazeniId = Number(id)

        const postoji = sastojci.some(
            (sastojak) => sastojak.id === trazeniId
        )

        if (!postoji) {
            throw new Error("Sastojak nije pronađen")
        }

        sastojci = sastojci.filter(
            (sastojak) => sastojak.id !== trazeniId
        )
    }
}

export default new SastojakServiceMemorija()

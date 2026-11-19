
import {collection, doc, getDocs, getDoc, runTransaction, updateDoc, deleteDoc} from "firebase/firestore"
import getFirebaseDB from "../Firebase"
import { PrefixStorage } from "../../constants"

const KOLEKCIJA = PrefixStorage.JEDINICE_MJERE
const BROJAC = "brojaci"

// ===================== SORT =====================

function sortirajJedinice(jedinice) {
    return [...jedinice].sort((a, b) =>
        a.naziv?.localeCompare(b.naziv, "hr")
    )
}

// ===================== READ =====================

async function get() {
    try {
        const snapshot = await getDocs(
            collection(getFirebaseDB(), KOLEKCIJA)
        )

        const jediniceMjere = snapshot.docs.map(d => ({
            ...d.data(),
            id: d.data().id ?? Number(d.id)
        }))

        return {
            success: true,
            data: sortirajJedinice(jediniceMjere)
        }

    } catch (e) {
        console.error("Greška kod dohvaćanja jedinica mjere:", e)

        return {
            success: false,
            data: [],
            message: e.message
        }
    }
}

// ===================== READ BY ID =====================

async function getById(id) {
    try {
        const docRef = doc(
            getFirebaseDB(),
            KOLEKCIJA,
            String(parseInt(id, 10))
        )

        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return {
                success: false,
                data: null
            }
        }

        return {
            success: true,
            data: {
                ...docSnap.data(),
                id: docSnap.data().id ?? Number(docSnap.id)
            }
        }

    } catch (e) {
        console.error("Greška kod dohvaćanja jedinice mjere:", e)

        return {
            success: false,
            data: null,
            message: e.message
        }
    }
}

// ===================== CREATE =====================

async function dodaj(jedinicaMjere) {
    try {
        const db = getFirebaseDB()

        const rezultat = await runTransaction(db, async (transaction) => {

            const brojacRef = doc(db, BROJAC, KOLEKCIJA)
            const brojacSnap = await transaction.get(brojacRef)

            const noviId = (brojacSnap.exists()
                ? brojacSnap.data().vrijednost
                : 0) + 1

            const novaJedinicaMjere = {
                ...jedinicaMjere,
                id: noviId
            }

            const jedinicaRef = doc(
                db,
                KOLEKCIJA,
                String(noviId)
            )

            transaction.set(brojacRef, {
                vrijednost: noviId
            })

            transaction.set(jedinicaRef, novaJedinicaMjere)

            return novaJedinicaMjere
        })

        return {
            success: true,
            data: rezultat
        }

    } catch (e) {
        console.error("Greška kod dodavanja jedinice mjere:", e)

        return {
            success: false,
            message: e.message
        }
    }
}

// ===================== UPDATE =====================

async function promijeni(id, jedinicaMjere) {
    try {
        const db = getFirebaseDB()

        const docRef = doc(
            db,
            KOLEKCIJA,
            String(parseInt(id, 10))
        )

        await runTransaction(db, async (transaction) => {
            const snapshot = await transaction.get(docRef)

            if (!snapshot.exists()) {
                throw new Error("Jedinica mjere ne postoji")
            }

            transaction.update(docRef, jedinicaMjere)
        })

        return {
            success: true,
            data: {
                ...jedinicaMjere,
                id: parseInt(id, 10)
            }
        }

    } catch (e) {
        console.error("Greška kod promjene jedinice mjere:", e)

        return {
            success: false,
            message: e.message
        }
    }
}

// ===================== DELETE =====================

async function obrisi(id) {
    try {
        const db = getFirebaseDB()

        const docRef = doc(
            db,
            KOLEKCIJA,
            String(parseInt(id, 10))
        )

        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return {
                success: false,
                message: "Jedinica mjere ne postoji"
            }
        }

        await deleteDoc(docRef)

        return {
            success: true,
            message: "Jedinica mjere uspješno obrisana"
        }

    } catch (e) {
        console.error("Greška kod brisanja jedinice mjere:", e)

        return {
            success: false,
            message: e.message
        }
    }
}

export default {
    get,
    getById,
    dodaj,
    promijeni,
    obrisi
}

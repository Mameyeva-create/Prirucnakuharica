
import { collection, doc, getDocs, getDoc, runTransaction, deleteDoc } from "firebase/firestore"
import getFirebaseDB from "../Firebase"
import { PrefixStorage } from "../../constants"

const KOLEKCIJA = PrefixStorage?.SASTOJCI || "sastojci"
const BROJAC = "brojaci"

// ===================== SORT =====================

function sortirajSastojke(sastojci) {
    return [...sastojci].sort((a, b) =>
        a.naziv?.localeCompare(b.naziv, 'hr')
    )
}

// ===================== READ =====================

async function get() {
    try {
        const snapshot = await getDocs(
            collection(getFirebaseDB(), KOLEKCIJA)
        )

        const sastojci = snapshot.docs.map(d => ({
            ...d.data(),
            id: d.data().id ?? Number(d.id)
        }))

        return {
            success: true,
            data: sortirajSastojke(sastojci)
        }

    } catch (e) {
        console.error("Greška kod dohvaćanja sastojaka:", e)

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
            data: docSnap.data()
        }

    } catch (e) {
        console.error("Greška kod dohvaćanja sastojka:", e)

        return {
            success: false,
            data: null,
            message: e.message
        }
    }
}

// ===================== CREATE =====================

async function dodaj(sastojak) {
    try {
        const db = getFirebaseDB()

        const rezultat = await runTransaction(db, async (transaction) => {

            const brojacRef = doc(db, BROJAC, KOLEKCIJA)
            const brojacSnap = await transaction.get(brojacRef)

            const noviId = (brojacSnap.exists()
                ? brojacSnap.data().vrijednost
                : 0) + 1

            const noviSastojak = {
                ...sastojak,
                id: noviId
            }

            const sastojakRef = doc(
                db,
                KOLEKCIJA,
                String(noviId)
            )

            transaction.set(brojacRef, {
                vrijednost: noviId
            })

            transaction.set(sastojakRef, noviSastojak)

            return noviSastojak
        })

        return {
            success: true,
            data: rezultat
        }

    } catch (e) {
        console.error("Greška kod dodavanja sastojka:", e)

        return {
            success: false,
            message: e.message
        }
    }
}

// ===================== UPDATE =====================
async function promijeni(id, sastojak) {
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
                throw new Error("Sastojak ne postoji")
            }

            transaction.update(docRef, sastojak)
        })

        return {
            success: true,
            data: {
                ...sastojak,
                id: parseInt(id, 10)
            }
        }

    } catch (e) {
        console.error("Greška kod promjene sastojka:", e)

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
        const docRef = doc(db, KOLEKCIJA,
            String(parseInt(id, 10)))

        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return {
                success: false,
                message: "Sastojak ne postoji"
            }
        }
        await deleteDoc(docRef)

        return {
            success: true,
            message: "Sastojak uspješno obrisan"
        }

    } catch (e) {
        console.error("Greška kod brisanja sastojka:", e)

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


import { collection, doc, getDocs, getDoc, runTransaction, deleteDoc, setDoc } from "firebase/firestore"
import getFirebaseDB from "../Firebase"
import { PrefixStorage } from "../../constants"

const KOLEKCIJA = PrefixStorage.SASTOJCI

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
            id: d.id
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
        const docRef = doc(getFirebaseDB(), KOLEKCIJA, String(id))
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
                id: docSnap.id
            }
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
        const sastojakRef = doc(collection(db, KOLEKCIJA))
        const noviSastojak = { ...sastojak, id: sastojakRef.id }
        await setDoc(sastojakRef, noviSastojak)

        return {
            success: true,
            data: noviSastojak
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
        const docRef = doc(db, KOLEKCIJA, String(id))
        
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
                id: String(id)
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
        const docRef = doc(db, KOLEKCIJA, String(id))
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

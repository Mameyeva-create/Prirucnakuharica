
import { collection, doc, getDocs, getDoc, runTransaction, writeBatch, deleteDoc, setDoc } from "firebase/firestore"
import getFirebaseDB from "../Firebase"
import { PrefixStorage } from "../../constants"
import { kategorije as pocetneKategorije } from "./KategorijaPodaci"

const KOLEKCIJA = PrefixStorage.KATEGORIJE

// ===================== SORT =====================
// Vraća redoslijed kategorije. Za stare zapise bez polja
// koristi se numerički ID (čuva stari poredak), inače Infinity.
function dohvatiRedoslijed(k) {
    if (typeof k.redoslijed === "number") return k.redoslijed

    const n = Number(k.id)
    return Number.isFinite(n) ? n : Infinity
}

function sortirajKategorije(kategorije) {
    return [...kategorije].sort((a, b) => {
        const ra = dohvatiRedoslijed(a)
        const rb = dohvatiRedoslijed(b)

        if (ra !== rb) return ra - rb

        return a.naziv?.localeCompare(b.naziv, "hr")
    })
}

// ===================== READ =====================
async function get() {
    try {
        const db = getFirebaseDB()

        let snapshot = await getDocs(
            collection(db, KOLEKCIJA)
        )

        // Prvi запуск: dodavanje početnih kategorija
        // if (snapshot.empty) {
        //     const batch = writeBatch(db)

        //     pocetneKategorije.forEach((k, index) => {
        //         const kategorijaRef = doc(db, KOLEKCIJA, String(k.id))

        //         batch.set(kategorijaRef, { ...k, id: String(k.id), redoslijed: k.redoslijed ?? index + 1 })
        //     })
        //     await batch.commit()

        //     // Ponovno dohvaćanje nakon inicijalizacije
        //     snapshot = await getDocs(
        //         collection(db, KOLEKCIJA)
        //     )
        // }

        const kategorije = snapshot.docs.map(d => ({
            ...d.data(),
            id: d.id
        }))

        return {
            success: true,
            data: sortirajKategorije(kategorije)
        }

    } catch (e) {
        console.error("Greška kod dohvaćanja kategorija:", e)

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
        console.error("Greška kod dohvaćanja kategorije:", e)

        return {
            success: false,
            data: null,
            message: e.message
        }
    }
}

// ===================== CREATE =====================
async function dodaj(kategorija) {
    try {
        const db = getFirebaseDB()
        const snapshot = await getDocs(collection(db, KOLEKCIJA)
        )
        const najveciRedoslijed = snapshot.docs.reduce((max, d) => {
            const r = dohvatiRedoslijed({ ...d.data(), id: d.id })
            return Math.max(max, Number.isFinite(r) ? r : 0)
        }, 0)
        const kategorijaRef = doc(collection(db, KOLEKCIJA))
        const novaKategorija = {
            ...kategorija,
            id: kategorijaRef.id,
            redoslijed: kategorija.redoslijed ?? najveciRedoslijed + 1
        }
        await setDoc(kategorijaRef, novaKategorija)

        return {
            success: true,
            data: novaKategorija
        }

    } catch (e) {
        console.error("Greška kod dodavanja kategorije:", e)

        return {
            success: false,
            message: e.message
        }
    }
}

// ===================== UPDATE =====================

async function promijeni(id, kategorija) {
    try {
        const db = getFirebaseDB()
        const docRef = doc(db, KOLEKCIJA, String(id))

        const rezultat = await runTransaction(db, async (transaction) => {
            const snapshot = await transaction.get(docRef)

            if (!snapshot.exists()) {
                throw new Error("Kategorija ne postoji")
            }

            const azuriranaKategorija = {
                ...snapshot.data(),
                ...kategorija,
                id: String(id)
            }
            transaction.update(docRef, kategorija)
            return azuriranaKategorija
        })
        return {
            success: true,
            data: rezultat
        }
    } catch (e) {
        console.error("Greška kod promjene kategorije:", e)

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
                message: "Kategorija ne postoji"
            }
        }
        await deleteDoc(docRef)
        return {
            success: true,
            message: "Kategorija uspješno obrisana"
        }

    } catch (e) {
        console.error("Greška kod brisanja kategorije:", e)

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

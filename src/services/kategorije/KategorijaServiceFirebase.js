
import { collection, doc, getDocs, getDoc, runTransaction, deleteDoc } from "firebase/firestore"
import getFirebaseDB from "../Firebase"
import { PrefixStorage } from "../../constants"
import { kategorije as pocetneKategorije } from "./KategorijaPodaci"

const KOLEKCIJA = PrefixStorage.KATEGORIJE
const BROJAC = "brojaci"

// ===================== READ =====================

async function get() {
    try {
        const db = getFirebaseDB()

        let snapshot = await getDocs(
            collection(db, KOLEKCIJA)
        )

        // Prvi запуск: dodavanje početnih kategorija
        if (snapshot.empty) {
            await runTransaction(db, async (transaction) => {

                const brojacRef = doc(db, BROJAC, KOLEKCIJA)
                const brojacSnap = await transaction.get(brojacRef)

                const reference = pocetneKategorije.map(k =>
                    doc(db, KOLEKCIJA, String(k.id))
                )

                const postojeciDokumenti = []

                // Sva čitanja prije pisanja
                for (const ref of reference) {
                    postojeciDokumenti.push(
                        await transaction.get(ref)
                    )
                }

                const postojeceKategorije = postojeciDokumenti
                    .filter(d => d.exists())

                // Ako je kolekcija još uvijek prazna, dodaj početne podatke
                if (postojeceKategorije.length === 0) {
                    pocetneKategorije.forEach((k, index) => {
                        transaction.set(reference[index], {
                            ...k,
                            id: Number(k.id)
                        })
                    })

                    const najveciId = Math.max(
                        ...pocetneKategorije.map(k => Number(k.id))
                    )

                    transaction.set(brojacRef, {
                        vrijednost: Math.max(
                            brojacSnap.exists()
                                ? brojacSnap.data().vrijednost
                                : 0,
                            najveciId
                        )
                    })
                }
            })

            // Ponovno dohvaćanje nakon inicijalizacije
            snapshot = await getDocs(
                collection(db, KOLEKCIJA)
            )
        }

        const kategorije = snapshot.docs
            .map(d => ({
                ...d.data(),
                id: d.data().id ?? Number(d.id)
            }))
            .sort((a, b) => a.id - b.id)

        return {
            success: true,
            data: kategorije
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

        const rezultat = await runTransaction(db, async (transaction) => {

            const brojacRef = doc(db, BROJAC, KOLEKCIJA)
            const brojacSnap = await transaction.get(brojacRef)

            const kategorijeSnapshot = await transaction.get(
                collection(db, KOLEKCIJA)
            )

            const najveciPostojeciId = kategorijeSnapshot.docs.reduce(
                (max, d) => Math.max(
                    max,
                    Number(d.data().id ?? d.id) || 0
                ),
                0
            )

            const zadnjiId = Math.max(
                brojacSnap.exists()
                    ? brojacSnap.data().vrijednost
                    : 0,
                najveciPostojeciId
            )

            const noviId = zadnjiId + 1

            const novaKategorija = {
                ...kategorija,
                id: noviId
            }

            const kategorijaRef = doc(
                db,
                KOLEKCIJA,
                String(noviId)
            )

            transaction.set(brojacRef, {
                vrijednost: noviId
            })

            transaction.set(kategorijaRef, novaKategorija)

            return novaKategorija
        })

        return {
            success: true,
            data: rezultat
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

        const docRef = doc(
            db,
            KOLEKCIJA,
            String(parseInt(id, 10))
        )

        const rezultat = await runTransaction(db, async (transaction) => {
            const snapshot = await transaction.get(docRef)

            if (!snapshot.exists()) {
                throw new Error("Kategorija ne postoji")
            }

            const azuriranaKategorija = {
                ...snapshot.data(),
                ...kategorija,
                id: parseInt(id, 10)
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

        const docRef = doc(
            db,
            KOLEKCIJA,
            String(parseInt(id, 10))
        )

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

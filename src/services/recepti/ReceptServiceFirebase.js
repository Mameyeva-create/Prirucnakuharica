
import { collection, doc, getDocs, getDoc, deleteDoc, setDoc, updateDoc } from "firebase/firestore"
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "../Firebase"
import { PrefixStorage } from "../../constants"

const KOLEKCIJA = PrefixStorage.RECEPTI

// ===================== Pomoćne funkcije ==========================================

// Dohvaća recept prema ID-u
async function dohvatiRecept(id) {
    const receptRef = doc(db, KOLEKCIJA, String(id))
    const snapshot = await getDoc(receptRef)

    if (!snapshot.exists()) {
        return null
    }
    return {
        ...snapshot.data(),
        id: snapshot.id
    }
}
// ===================== Učitava fotografiju u Firebase Storage =====================
async function ucitajSliku(slika, id) {
    if (!slika || !slika.startsWith("data:image/")) {
        return {
            slika: slika || "",
            slikaPutanja: ""
        }
    }
    const nazivDatoteke = `${Date.now()}-${Math.random()
        .toString(36).substring(2, 9)}.jpg`
    const putanja = `recepti/${id}/${nazivDatoteke}`
    const slikaRef = ref(storage, putanja)

    await uploadString(slikaRef, slika, "data_url", {
        contentType: "image/jpeg"
    })
    const url = await getDownloadURL(slikaRef)

    return {
        slika: url,
        slikaPutanja: putanja
    }
}
// ===================== Briše fotografiju iz Firebase Storage =====================
async function obrisiSliku(putanja) {
    if (!putanja) return

    try {
        const slikaRef = ref(storage, putanja)
        await deleteObject(slikaRef)
    } catch (error) {
        // Fotografija možda već ne postoji
        if (error.code !== "storage/object-not-found") {
            console.error("Greška pri brisanju fotografije:", error)
        }
    }
}
// ===================== Dohvaća sve recepte =========================================
async function get() {
    const snapshot = await getDocs(collection(db, KOLEKCIJA))
    const recepti = snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id
    }))
    recepti.sort((a, b) => a.naziv?.localeCompare(b.naziv, "hr"))

    return { data: recepti }
}
// ===================== Dohvaća jedan recept prema ID-u ==============================
async function getById(id) {
    const recept = await dohvatiRecept(id)

    return { data: recept }
}
// ===================== Dodaje novi recept ===========================================
async function dodaj(recept) {
    const receptRef = doc(collection(db, KOLEKCIJA))
    const noviId = receptRef.id

    let novaSlika = {
        slika: recept.slika || "",
        slikaPutanja: recept.slikaPutanja || ""
    }

    try {
        novaSlika = await ucitajSliku(recept.slika, noviId)

        const noviRecept = {
            ...recept,
            ...novaSlika,
            id: noviId
        }
        await setDoc(receptRef, noviRecept)

        return { data: noviRecept }

    } catch (error) {
        // Ako spremanje ne uspije, uklanjamo novoučitanu fotografiju
        await obrisiSliku(novaSlika.slikaPutanja)
        throw error
    }
}
// ===================== Mijenja postojeći recept ===================================
async function promijeni(id, recept) {
    const postojeciRecept = await dohvatiRecept(id)

    if (!postojeciRecept) {
        throw new Error("Recept nije pronađen.")
    }

    const receptRef = doc(db, KOLEKCIJA, String(id))

    const staraPutanja = postojeciRecept.slikaPutanja || ""

    let novaSlika = {
        slika: recept.slika || "",
        slikaPutanja: recept.slikaPutanja || ""
    }

    // Ako je odabrana nova Base64 fotografija, učitavamo je
    if (recept.slika?.startsWith("data:image/")) {
        novaSlika = await ucitajSliku(recept.slika, String(id))
    } else if (recept.slika) {
        // Fotografija nije promijenjena
        novaSlika = {
            slika: recept.slika,
            slikaPutanja: recept.slikaPutanja || staraPutanja
        }
    }

    const promijenjeniRecept = {
        ...postojeciRecept,
        ...recept,
        ...novaSlika,
        id: String(id)
    }

    try {
        await updateDoc(receptRef, promijenjeniRecept)

    } catch (error) {
        // Ako spremanje ne uspije, čuvamo staru fotografiju
        if (
            novaSlika.slikaPutanja &&
            novaSlika.slikaPutanja !== staraPutanja
        ) {
            await obrisiSliku(novaSlika.slikaPutanja)
        }
        throw error
    }
    // Staru fotografiju brišemo tek nakon uspješnog spremanja
    if (staraPutanja && staraPutanja !== novaSlika.slikaPutanja) {
        await obrisiSliku(staraPutanja)
    }
    return { data: promijenjeniRecept }
}
// ===================== Briše jedan recept prema ID-u ==============================
async function obrisi(id) {
    const recept = await dohvatiRecept(id)

    if (!recept) {
        return
    }
    const receptRef = doc(db, KOLEKCIJA, String(id))

    await deleteDoc(receptRef)

    // Nakon brisanja recepta uklanjamo i fotografiju
    await obrisiSliku(recept.slikaPutanja)
}

export default {
    get,
    getById,
    dodaj,
    promijeni,
    obrisi
}

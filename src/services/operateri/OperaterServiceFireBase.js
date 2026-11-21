import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, limit } from "firebase/firestore"
import bcrypt from 'bcryptjs'
import { db } from "../Firebase"
import { PrefixStorage } from "../../constants"

const KOLEKCIJA = PrefixStorage.OPERATERI

// Pronalazi operatera po emailu (vraća dokument ili null)
async function nadiPoEmailu(email) {
    const q = query(
        collection(db, KOLEKCIJA),
        where("email", "==", email),
        limit(1)
    )
    const snapshot = await getDocs(q)

    return snapshot.empty ? null : snapshot.docs[0]
}

// Operater bez lozinke (za vraćanje prema van)
function bezLozinke(id, podaci) {
    const { lozinka, ...ostatak } = podaci
    return { ...ostatak, id }
}

// ===================== READ =====================

async function get() {
    try {
        const snapshot = await getDocs(collection(db, KOLEKCIJA))
        const data = snapshot.docs.map(d => bezLozinke(d.id, d.data()))

        return { success: true, data }
    } catch (e) {
        console.error("Greška kod dohvaćanja operatera:", e)
        return { success: false, data: [], message: e.message }
    }
}

async function getById(id) {
    try {
        const docSnap = await getDoc(doc(db, KOLEKCIJA, String(id)))

        if (!docSnap.exists()) {
            return { success: false, data: null, message: "Operater ne postoji" }
        }
        return { success: true, data: bezLozinke(docSnap.id, docSnap.data()) }
    } catch (e) {
        console.error("Greška kod dohvaćanja operatera:", e)
        return { success: false, data: null, message: e.message }
    }
}

// ===================== CREATE =====================

async function dodaj(operater) {
    try {
        const email = operater.email.trim().toLowerCase()

        if (await nadiPoEmailu(email)) {
            return { success: false, message: "Operater s ovim emailom već postoji" }
        }

        const noviOperater = {
            email,
            lozinka: bcrypt.hashSync(operater.lozinka, 10),
            uloga: operater.uloga || "korisnik",
            ime: operater.ime ?? "",
            prezime: operater.prezime ?? "",
            generirano: operater.generirano ?? false
        }

        const docRef = await addDoc(collection(db, KOLEKCIJA), noviOperater)

        return {
            success: true,
            data: { id: docRef.id, email, uloga: noviOperater.uloga }
        }
    } catch (e) {
        console.error("Greška kod dodavanja operatera:", e)
        return { success: false, message: e.message }
    }
}

// Za prijenos iz memorije: lozinka je već hash, pa se ne hashira ponovno
async function dodajBezHash(operater) {
    try {
        const email = operater.email.trim().toLowerCase()

        const noviOperater = {
            email,
            lozinka: operater.lozinka,
            uloga: operater.uloga ?? "korisnik",
            ime: operater.ime ?? "",
            prezime: operater.prezime ?? "",
            generirano: operater.generirano ?? false
        }

        const docRef = await addDoc(collection(db, KOLEKCIJA), noviOperater)

        return { success: true, data: { id: docRef.id, email } }
    } catch (e) {
        console.error("Greška kod dodavanja operatera:", e)
        return { success: false, message: e.message }
    }
}

// ===================== UPDATE =====================

async function promijeni(id, operater) {
    try {
        const podaci = {}
        if (operater.email !== undefined) podaci.email = operater.email.trim().toLowerCase()
        if (operater.uloga !== undefined) podaci.uloga = operater.uloga
        if (operater.ime !== undefined) podaci.ime = operater.ime
        if (operater.prezime !== undefined) podaci.prezime = operater.prezime

        await updateDoc(doc(db, KOLEKCIJA, String(id)), podaci)

        return { success: true, data: { ...podaci, id: String(id) } }
    } catch (e) {
        console.error("Greška kod promjene operatera:", e)
        return { success: false, message: e.message }
    }
}

async function promijeniLozinku(id, novaLozinka) {
    try {
        await updateDoc(doc(db, KOLEKCIJA, String(id)), {
            lozinka: bcrypt.hashSync(novaLozinka, 10)
        })

        return { success: true, message: "Lozinka uspješno promijenjena" }
    } catch (e) {
        console.error("Greška kod promjene lozinke:", e)
        return { success: false, message: e.message }
    }
}

// ===================== DELETE =====================

async function obrisi(id) {
    try {
        await deleteDoc(doc(db, KOLEKCIJA, String(id)))

        return { success: true, message: "Operater obrisan" }
    } catch (e) {
        console.error("Greška kod brisanja operatera:", e)
        return { success: false, message: e.message }
    }
}

// ===================== PRIJAVA =====================

async function prijava(email, lozinka) {
    try {
        const poruka = "Email i lozinka ne odgovaraju"

        const dokument = await nadiPoEmailu(email.trim().toLowerCase())
        if (!dokument) {
            return { success: false, message: poruka }
        }

        const podaci = dokument.data()

        if (!bcrypt.compareSync(lozinka, podaci.lozinka)) {
            return { success: false, message: poruka }
        }

        return { success: true, data: bezLozinke(dokument.id, podaci) }
    } catch (e) {
        console.error("Greška kod prijave:", e)
        return { success: false, message: "Greška pri prijavi" }
    }
}

export default {
    get,
    getById,
    dodaj,
    dodajBezHash,
    promijeni,
    promijeniLozinku,
    obrisi,
    prijava
}
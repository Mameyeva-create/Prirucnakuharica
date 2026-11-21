import { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from "firebase/auth"
import { db, auth } from "../Firebase"
import { PrefixStorage } from "../../constants"


const KOLEKCIJA = PrefixStorage.OPERATERI

// ===================== READ =====================
async function get() {
    try {
        const snapshot = await getDocs(collection(db, KOLEKCIJA))
        // Lozinke (hash) se ne vraćaju
        const data = snapshot.docs.map(d => {
            const { lozinka, ...ostatak } = d.data()
            return { ...ostatak, id: d.id }
        })
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
        const { lozinka, ...ostatak } = docSnap.data()
        return { success: true, data: { ...ostatak, id: docSnap.id } }
    } catch (e) {
        console.error("Greška kod dohvaćanja operatera:", e)
        return { success: false, data: null, message: e.message }
    }
}

// ===================== CREATE =====================
async function dodaj(operater) {
    try {
        const { email, lozinka, uloga = "korisnik", ime = "", prezime = "",
            generirano = false } = operater

        // 1. Kreiranje korisnika u Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, lozinka)
        const uid = userCredential.user.uid

        // 2. Spremanje dodatnih podataka u Firestore (bez lozinke!)
        await setDoc(doc(db, KOLEKCIJA, uid), {
            email,
            uloga,
            ime,
            prezime,
            generirano,
            createdAt: new Date().toISOString()
        })

        return { success: true, data: { id: uid, email, uloga } }
    } catch (e) {
        console.error("Greška kod dodavanja operatera:", e)
        return { success: false, message: e.message }
    }
}
// Dodaje operatera samo u Firestore (za prijenos iz memorije, lozinka je već hash)
async function dodajBezHash(operater) {
    try {
        const noviOperater = {
            email: operater.email,
            uloga: operater.uloga ?? "korisnik",
            lozinka: operater.lozinka,
            ime: operater.ime ?? "",
            prezime: operater.prezime ?? "",
            generirano: operater.generirano ?? false
        }

        const docRef = await addDoc(collection(db, KOLEKCIJA), noviOperater)
        return { success: true, data: { id: docRef.id, email: operater.email } }
    } catch (e) {
        console.error("Greška kod dodavanja operatera:", e)
        return { success: false, message: e.message }
    }
}
// ===================== UPDATE =====================
async function promijeni(id, operater) {
    try {
        // Mijenja se samo ono što je spremljeno u Firestoreu
        const podaci = {}
        if (operater.email !== undefined) podaci.email = operater.email
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

// ===================== CHANGE PASSWORD =====================
async function promijeniLozinku(id, novaLozinka) {
    try {
        const user = auth.currentUser
        // Lozinku možete mijenjati samo sebi (или через Admin SDK)
        if (!user || user.uid !== id) {
            return { success: false, message: "Možete mijenjati samo svoju lozinku" }
        }
        await updatePassword(user, novaLozinka)
        return { success: true, message: "Lozinka uspješno promijenjena" }
    } catch (e) {
        console.error("Greška kod promjene lozinke:", e)
         // Često: auth/requires-recent-login
        return { success: false, message: e.message }
    }
}

// ===================== DELETE =====================
async function obrisi(id) {
    try {
        // Briše se samo dokument u Firestoreu (korisnik u Auth ostaje)
        await deleteDoc(doc(db, KOLEKCIJA, String(id)))

        return { success: true, message: "Operater obrisan iz baze" }
    } catch (e) {
        console.error("Greška kod brisanja operatera:", e)
        return { success: false, message: e.message }
    }
}

// ===================== PRIJAVA =====================
async function prijava(email, lozinka) {
    try {
        // 1. Вход через Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, lozinka)
        const user = userCredential.user

        const docSnap = await getDoc(doc(db, KOLEKCIJA, user.uid))
        const podaci = docSnap.exists() ? docSnap.data() : {}

        return {
            success: true,
            data: {
                id: user.uid,
                email: user.email,
                ime: podaci.ime ?? "",
                prezime: podaci.prezime ?? "",
                uloga: podaci.uloga || "korisnik"
            }
        }
    } catch (e) {
        console.error("Greška kod prijave:", e)

        let message = "Greška pri prijavi"
        if (["auth/user-not-found", "auth/wrong-password", "auth/invalid-credential"].includes(e.code)) {
            message = "Pogrešan email ili lozinka"
        } else if (e.code === "auth/too-many-requests") {
            message = "Previše pokušaja. Pokušajte kasnije."
        }
        return { success: false, message }
    }
}
async function dodajBezHash(operater) {
    try {
        const noviOperater = {
            email: operater.email,
            uloga: operater.uloga,
            lozinka: operater.lozinka,
            ime: operater.ime ?? "",
            prezime: operater.prezime ?? "",
            generirano: operater.generirano ?? false
        }
        const docRef = await addDoc(collection(db, KOLEKCIJA), noviOperater)
        return {
            success: true,
            data: { id: docRef.id, email: operater.email }
        }
    } catch (e) {
        console.error("Greška kod dodavanja operatera:", e)
        return { success: false, message: e.message }
    }
}

export default {
    get,
    getById,
    dodaj,
    promijeni,
    promijeniLozinku,
    obrisi,
    prijava,
    dodajBezHash
}
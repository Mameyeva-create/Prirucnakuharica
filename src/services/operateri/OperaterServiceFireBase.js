import { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword } from "firebase/auth"
import { db, auth } from "../Firebase"
import { PrefixStorage } from "../../constants"


const KOLEKCIJA = PrefixStorage.OPERATERI

// ===================== READ =====================
async function get() {
    try {
        const snapshot = await getDocs(collection(db, KOLEKCIJA))
        const data = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
        }))
        return { success: true, data }
    } catch (e) {
        console.error("Greška kod dohvaćanja operatera:", e)
        return { success: false, data: [], message: e.message }
    }
}

async function getById(id) {
    try {
        const docSnap = await getDoc(doc(db, KOLEKCIJA, id))
        if (!docSnap.exists()) {
            return { success: false, data: null, message: "Operater ne postoji" }
        }
        return {
            success: true,
            data: { id: docSnap.id, ...docSnap.data() }
        }
    } catch (e) {
        return { success: false, data: null, message: e.message }
    }
}

// ===================== CREATE =====================
async function dodaj(operater) {
    try {
        const { email, lozinka, uloga = "korisnik", ime = "", prezime = "",
            generirano = false } = operater

        // 1. Создаём пользователя в Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, lozinka)
        const uid = userCredential.user.uid

        // 2. Сохраняем дополнительные данные в Firestore (без пароля!)
        await setDoc(doc(db, KOLEKCIJA, uid), {
            email,
            uloga,
            ime,
            prezime,
            generirano,
            createdAt: new Date().toISOString()
        })

        return {
            success: true,
            data: { id: uid, email, uloga }
        }
    } catch (e) {
        console.error("Greška kod dodavanja operatera:", e)
        return { success: false, message: e.message }
    }
}

// ===================== UPDATE =====================
async function promijeni(id, operater) {
    try {
        // Можно менять только то, что хранится в Firestore (email + uloga)
        const updateData = {}
        if (operater.email !== undefined) updateData.email = operater.email
        if (operater.uloga !== undefined) updateData.uloga = operater.uloga

        await updateDoc(doc(db, KOLEKCIJA, id), updateData)
        return { success: true }
    } catch (e) {
        console.error("Greška kod promjene operatera:", e)
        return { success: false, message: e.message }
    }
}

// ===================== CHANGE PASSWORD =====================
async function promijeniLozinku(id, novaLozinka) {
    try {
        const user = auth.currentUser

        // Менять пароль можно только самому себе (или через Admin SDK)
        if (!user || user.uid !== id) {
            return {
                success: false,
                message: "Možete mijenjati samo svoju lozinku"
            }
        }

        await updatePassword(user, novaLozinka)
        return { success: true }
    } catch (e) {
        console.error("Greška kod promjene lozinke:", e)
        // Часто бывает requires-recent-login
        return { success: false, message: e.message }
    }
}

// ===================== DELETE =====================
async function obrisi(id) {
    try {
        // Удаляем документ из Firestore
        await deleteDoc(doc(db, KOLEKCIJA, id))

        // Удаление из Auth возможно только если это текущий пользователь
        // или через Admin SDK. Здесь просто удаляем из Firestore.
        return { success: true, message: "Operater obrisan iz baze" }
    } catch (e) {
        console.error("Greška kod brisanja operatera:", e)
        return { success: false, message: e.message }
    }
}

// ===================== LOGIN =====================
async function prijava(email, lozinka) {
    try {
        // 1. Вход через Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, lozinka)
        const user = userCredential.user

        // 2. Достаём роль из Firestore
        const docSnap = await getDoc(doc(db, KOLEKCIJA, user.uid))

        let uloga = "korisnik"
        if (docSnap.exists()) {
            uloga = docSnap.data().uloga || "korisnik"
        }

        return {
            success: true,
            data: {
                id: user.uid,
                email: user.email,
                uloga
            }
        }
    } catch (e) {
        console.error("Greška kod prijave:", e)

        let message = "Greška pri prijavi"
        if (e.code === "auth/user-not-found" || e.code === "auth/wrong-password") {
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
        return { success: false, message: e.message };
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
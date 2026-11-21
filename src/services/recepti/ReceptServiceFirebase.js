
import { collection, doc, getDocs, getDoc, deleteDoc, setDoc } from "firebase/firestore"
import { db } from "../Firebase"
import { PrefixStorage } from "../../constants"

const KOLEKCIJA = PrefixStorage.RECEPTI

// Firestore dokument može imati najviše 1 MB, ostavljamo rezervu za ostala polja
const MAX_VELICINA_SLIKE = 700 * 1024

// ===================== Pomoćne funkcije ==========================================

// Dohvaća recept prema ID-u
async function dohvatiRecept(id) {
    const snapshot = await getDoc(doc(db, KOLEKCIJA, String(id)))

    if (!snapshot.exists()) {
        return null
    }
    return { ...snapshot.data(), id: snapshot.id }
}
// Uklanja zastarjela polja slike (ostaje samo slikaBase64)
function ocisti(recept) {
    const { slika, slikaPutanja, ...ostatak } = recept
    return ostatak
}

// Smanjuje sliku (data URL) na zadanu najveću stranicu i JPEG kvalitetu
function smanjiSliku(dataUrl, maxStranica, kvaliteta) {
    return new Promise((resolve, reject) => {
        const img = new Image()

        img.onload = () => {
            const omjer = Math.min(1, maxStranica / Math.max(img.width, img.height))
            const canvas = document.createElement("canvas")
            canvas.width = Math.round(img.width * omjer)
            canvas.height = Math.round(img.height * omjer)
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL("image/jpeg", kvaliteta))
        }
        img.onerror = () => reject(new Error("Slika se ne može učitati."))
        img.src = dataUrl
    })
}

// Priprema sliku za Firestore (smanjuje dok ne stane u limit)
async function pripremiSliku(slika) {
    // Prazno ili vanjski URL: ne diramo
    if (!slika || !slika.startsWith("data:image/")) {
        return slika || ""
    }

    let stranica = 800
    let kvaliteta = 0.7
    let rezultat = await smanjiSliku(slika, stranica, kvaliteta)

    while (rezultat.length > MAX_VELICINA_SLIKE && stranica > 200) {
        stranica -= 150
        kvaliteta = Math.max(0.4, kvaliteta - 0.1)
        rezultat = await smanjiSliku(slika, stranica, kvaliteta)
    }

    if (rezultat.length > MAX_VELICINA_SLIKE) {
        throw new Error("Slika je prevelika za spremanje.")
    }
    return rezultat
}

// ===================== READ =====================

async function get() {
    const snapshot = await getDocs(collection(db, KOLEKCIJA))
    const recepti = snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
    recepti.sort((a, b) => a.naziv?.localeCompare(b.naziv, "hr"))

    return { data: recepti }
}

async function getById(id) {
    return { data: await dohvatiRecept(id) }
}

// ===================== CREATE =====================

async function dodaj(recept) {
    const receptRef = doc(collection(db, KOLEKCIJA))

    const noviRecept = {
        ...ocisti(recept),
        slikaBase64: await pripremiSliku(recept.slikaBase64),
        id: receptRef.id
    }

    await setDoc(receptRef, noviRecept)

    return { data: noviRecept }
}

// ===================== UPDATE =====================

async function promijeni(id, recept) {
    const postojeciRecept = await dohvatiRecept(id)

    if (!postojeciRecept) {
        throw new Error("Recept nije pronađen.")
    }

    const promijenjeniRecept = {
        ...ocisti(postojeciRecept),
        ...ocisti(recept),
        slikaBase64: recept.slikaBase64 !== undefined
            ? await pripremiSliku(recept.slikaBase64)
            : postojeciRecept.slikaBase64 || "",
        id: String(id)
    }

    // setDoc prepisuje cijeli dokument, pa stara polja slika/slikaPutanja nestaju
    await setDoc(doc(db, KOLEKCIJA, String(id)), promijenjeniRecept)

    return { data: promijenjeniRecept }
}

// ===================== DELETE =====================

async function obrisi(id) {
    const recept = await dohvatiRecept(id)

    if (!recept) {
        return
    }
    await deleteDoc(doc(db, KOLEKCIJA, String(id)))
}

export default {
    get,
    getById,
    dodaj,
    promijeni,
    obrisi
}
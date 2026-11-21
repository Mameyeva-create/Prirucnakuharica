
import { createContext, useContext, useState } from 'react'
import OperaterService from '../services/operateri/OperaterService'

const AuthContext = createContext()

const STORAGE_KEY = 'prijavljeniOperater'

// Dohvaćanje prijavljenog operatera iz sessionStoragea
function dohvatiPrijavljenogOperatera() {
    const podaci = sessionStorage.getItem(STORAGE_KEY)

    if (!podaci) {
        return null
    }

    try {
        return JSON.parse(podaci)
    } catch {
        sessionStorage.removeItem(STORAGE_KEY)
        return null
    }
}

export function AuthProvider({ children }) {

    const [prijavljeniOperater, setPrijavljeniOperater] = useState(
        dohvatiPrijavljenogOperatera
    )

    // Provjera je li korisnik prijavljen
    const jePrijavljen = prijavljeniOperater !== null

    // Provjera je li korisnik administrator
    const jeAdmin = prijavljeniOperater?.uloga === 'admin'

    // Prijava korisnika
    async function prijava(email, lozinka) {
        const rezultat = await OperaterService.prijava(email, lozinka)

        if (rezultat.success) {
            setPrijavljeniOperater(rezultat.data)

            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(rezultat.data)
            )
        }

        return rezultat
    }
    // Registracija novog korisnika (uvijek uloga 'korisnik')
    async function registracija({ email, lozinka }) {
        const postojeci = await OperaterService.get()
        if (!postojeci.success) {
            return { success: false, message: 'Servis nije dostupan' }
        }
        const zauzet = postojeci.data.some(
            o => o.email.toLowerCase() === email.trim().toLowerCase()
        )
        if (zauzet) {
            return { success: false, message: 'Korisnik s tim emailom već postoji!' }
        }
        return await OperaterService.dodaj({
            email: email.trim(),
            lozinka,
            uloga: 'korisnik',
            generirano: false
        })
    }

    // Odjava korisnika
    function odjava() {
        setPrijavljeniOperater(null)
        sessionStorage.removeItem(STORAGE_KEY)
    }

    return (
        <AuthContext.Provider
            value={{
                prijavljeniOperater,
                jePrijavljen,
                jeAdmin,
                prijava,
                odjava,
                registracija
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Hook za korištenje AuthContexta
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth se mora koristiti unutar AuthProvider-a')
    }
    return context
}

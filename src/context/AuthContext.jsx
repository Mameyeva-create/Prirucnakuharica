
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
                odjava
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Hook za korištenje AuthContexta
export function useAuth() {
    return useContext(AuthContext)
}

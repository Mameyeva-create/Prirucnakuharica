
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ZasticenaRuta({ children, samoAdmin = false }) {
    const { jePrijavljen, jeAdmin } = useAuth()

    // Ako korisnik nije prijavljen, šaljemo ga na prijavu
    if (!jePrijavljen) {
        return <Navigate to="/prijava" replace />
    }

    // Ako je stranica samo za administratora,
    // a prijavljen je običan korisnik, šaljemo ga na početnu
    if (samoAdmin && !jeAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ZasticenaRuta

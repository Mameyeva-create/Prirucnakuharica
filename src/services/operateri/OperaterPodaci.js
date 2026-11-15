import bcrypt from 'bcryptjs'

// Inicijalni operateri s hashiranim lozinkama
// Lozinka za sve: "Edunova123!"
const hashiranaLozinka = bcrypt.hashSync('Edunova123!', 10)

export const operateri = [
    {
        id: '1',
        email: 'admin@edunova.hr',
        lozinka: hashiranaLozinka,
        uloga: 'admin'
    },
    {
        id: '2',
        email: 'operater@edunova.hr',
        lozinka: hashiranaLozinka,
        uloga: 'korisnik'
    }
]

export default{
    operateri
}
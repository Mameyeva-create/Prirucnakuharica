export const IME_APLIKACIJE = 'Priručna kuharica'

export const RouteNames = {
    HOME: '/',
    PRIJAVA: '/prijava',
    REGISTRACIJA: '/registracija',
    RECEPTI: '/recepti',
    RECEPTI_NOVI: '/recepti/novi',
    OMILJENI: '/omiljeni',
    VEGANSKO: '/vegansko',
    RECEPTI_PROMJENA: '/recepti/:id',

    KATEGORIJE: '/kategorije',
    KATEGORIJE_NOVI: '/kategorije/novi',
    KATEGORIJE_PROMJENA: '/kategorije/:id',

    SASTOJCI: '/sastojci',
    SASTOJAK_NOVI: '/sastojci/novi',
    SASTOJAK_PROMJENA: '/sastojci/:id',


    JEDINICE_MJERE: '/jediniceMjere',
    JEDINICE_MJERE_NOVI: '/jediniceMjere/novi',
    JEDINICE_MJERE_PROMJENA: '/jediniceMjere/:id',

    OPERATERI: '/operateri',
    OPERATERI_NOVI: '/operateri/novi',
    OPERATERI_PROMJENA: '/operateri/:id',
    OPERATERI_PROMJENA_LOZINKE: '/operateri/:id/lozinka',

    GENERIRANJE_PODATAKA: '/generiranje-podataka'

}
// memorija, LocalStorage, firebase
export const DATA_SOURCE = 'memorija'

// Predavač je e.
// Polaznici su eN. gdje je N broj s origo servera (npr e1.)
export const PrefixStorage = {
    RECEPTI: 'e5.recepti',
    KATEGORIJE: 'e5.kategorije',
    SASTOJCI: 'e5.sastojci',
    JEDINICE_MJERE: 'e5.jediniceMjere',
    OPERATERI: 'e5.operateri'
} 
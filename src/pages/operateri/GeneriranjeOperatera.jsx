
import { useState } from 'react'
import { faker } from '@faker-js/faker/locale/hr'
import { Alert, Button, Card, Col, Form, Row, Table, Spinner } from 'react-bootstrap'
import OperaterService from '../../services/operateri/OperaterService'
import GeneratorKartica from '../../components/GeneratorKartica'
import { RouteNames } from '../../constants'



// Uklanjanje dijakritičkih znakova iz imena
function pripremiEmail(tekst) {
    return tekst
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '.')
        .replace(/\.+/g, '.')
        .replace(/^\.|\.$/g, '')
}
// Generiranje jedinstvenog emaila
function generirajEmail(ime, prezime, postojeciEmailovi) {
    const osnova = `${pripremiEmail(ime)}.${pripremiEmail(prezime)}`
    let email = `${osnova}@example.com`
    let brojac = 1
    while (postojeciEmailovi.has(email)) {
        email = `${osnova}${brojac}@example.com`
        brojac++
    }
    postojeciEmailovi.add(email)
    return email
}
async function generiraj(broj) {
    const odgovor = await OperaterService.get()
    if (!odgovor.success) {
        throw new Error('Ne mogu dohvatiti postojeće operatere');
    }
    const postojeciEmailovi = new Set(
        odgovor.data.map(op => op.email.toLowerCase())
    )
    let dodano = 0
    try {
        for (let i = 0; i < broj; i++) {
            const email = generirajEmail(
                faker.person.firstName(),
                faker.person.lastName(),
                postojeciEmailovi
            )
            const rezultat = await OperaterService.dodaj({
                email,
                lozinka: `Kuhinja${faker.string.alphanumeric(8)}!9`,
                uloga: 'korisnik',
                generirano: true,
            })
            if (!rezultat.success) {
                throw new Error(`Greška kod spremanja: ${email}`)
            }
            dodano++
        }
    } catch (error) {
        throw new Error(`Dodano operatera: ${dodano}. ${error.message}`)
    }
    return `Uspješno generirano testnih operatera: ${dodano}`
}
// Brisanje generiranih operatera
async function obrisi() {
    const odgovor = await OperaterService.get()
    if (!odgovor.success) {
        throw new Error('Ne mogu dohvatiti operatere')
    }
    const tekuci = JSON.parse(sessionStorage.getItem('prijavljeniOperater') || 'null')
    const generirani = odgovor.data.filter(op =>
        op.generirano === true &&
        op.email.toLowerCase() !== tekuci?.email?.toLowerCase()
    )
    let obrisano = 0
    for (const op of generirani) {
        const rezultat = await OperaterService.obrisi(op.id)
        if (!rezultat.success) {
            throw new Error(`Obrisano: ${obrisano}. Greška kod brisanja operatera ${op.id}`)
        }
        obrisano++
    }
    return `Obrisano generiranih operatera: ${obrisano}.`
}

export default function GeneriranjeOperatera() {
    return (
        <GeneratorKartica
            naslov="Generiranje testnih operatera"
            labelBroj="Broj operatera za generuranje"
            pocetniBroj={10}
            max={100}
            putanjaPrikaza={RouteNames.OPERATERI + '?generirani=true'}
            tekstGeneriraj="Generiraj operatere"
            tekstPrikaza="Prikaži operatere"
            tekstBrisanja="Obriši generirane operatere"
            potvrdaBrisanja="Obrisati sve generirane operatere?"
            generiraj={generiraj}
            obrisi={obrisi}
        />
    )
}





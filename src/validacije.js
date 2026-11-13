import { data } from 'react-router-dom'
import { size, z } from 'zod'
import { kategorije } from './services/kategorije/KategorijaPodaci'


// Возвращает { ok: true, data } или { ok: false, greska } (текст первой ошибки)
export function validiraj(schema, podaci) {
    const rezultat = schema.safeParse(podaci)
    if (rezultat.success) return { ok: true, data: rezultat.data }
    return { ok: false, greska: rezultat.error.issues[0].message }
}

export const kategorijaSchema = z.object({
    naziv: z.string().trim().min(2, 'Naziv kategorije mora imati najmanje 2 znaka')
})

export const stavkaSastojkaSchema = z.object({
    sastojak: z.coerce.number().int().positive('Odaberite sastojak iz popisa'),
    kolicina: z.coerce.number().positive('Unesite ispravnu količinu'),
    jedMjere: z.coerce.number().int().positive('Odaberite jedinicu mjere')
})

export const receptSchema = z.object({
    naziv: z.string().trim().min(2, 'Naziv recepta mora imati najmanje 2 znaka'),
    kategorija: z.coerce.number().int().positive('Odaberite kategoriju'),
    vrijeme: z.coerce.number()
        .int('Vrijeme mora biti cijeli broj')
        .min(1, 'Vrijeme mora biti između 1 i 300 minuta')
        .max(300, 'Vrijeme mora biti između 1 i 300 minuta'),
    opis: z.string().trim().min(5, 'Opis recepta mora imati najmanje 5 znakova'),
    priprema: z.string().trim().default(''),
    sastojci: z.array(stavkaSastojkaSchema).min(1, 'Dodaj barem jedan sastojak u recept'),
    omiljen: z.boolean(),
    vegansko: z.boolean(),
})

export const  pretragaSchema = z.string().trim().min(3, 'Unesi najmanje 3 znaka za pretragu')

export const brojGeneriranjaSchema = (max) =>
    z.coerce.number()
.int(`Unesi broj između 1 i ${max}.`)
.min(1, `Unesi broj između 1 i ${max}.`)
.max(max, `Unesi brij između 1 i ${max}.`)

export const jedinicaMjereSchema = z.object({
    naziv: z.string().trim()
    .min(1, 'Unesite naziv jedinice mjere')
    .max(50, 'Naziv jedinice mjere je predug')
})

const MAX_VELICINA_SLIKE = 10 * 1024 * 1024
 
export const slikaDatotekaSchema = z.instanceof(File)
.refine(d => d.type.startsWith('image/'), 'Odaberite datoteku slike')
.refine(d => size <= MAX_VELICINA_SLIKE, 'Slika ne smije biti veća od 10 MB')
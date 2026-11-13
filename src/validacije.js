
import { z } from 'zod'

// Возвращает { ok: true, data } или { ok: false, greska } (текст первой ошибки)
export function validiraj(schema, podaci) {
    const rezultat = schema.safeParse(podaci)
    if (rezultat.success) return { ok: true, data: rezultat.data }
    return { ok: false, greska: rezultat.error.issues[0].message }
}
const idPolje = (poruka) =>
    z.coerce.number({ error: poruka }).int(poruka).positive(poruka)

export const kategorijaSchema = z.object({
    naziv: z.string().trim().min(2, 'Naziv kategorije mora imati najmanje 2 znaka')
})

export const stavkaSastojkaSchema = z.object({
    sastojak: idPolje('Odaberite sastojak iz popisa'),
    kolicina: z.coerce.number({ error: 'Unesite ispravnu količinu'}).positive('Unesite ispravnu količinu'),
    jedMjere: idPolje('Odaberite jedinicu mjere')
})

export const sastojakSchema = z.object({
    naziv: z.string().trim()
        .min(1, 'Unesite naziv sastojka')
        .max(100, 'Naziv sastojka je predug'),
})
export const receptSchema = z.object({
            naziv: z.string().trim().min(2, 'Naziv recepta mora imati najmanje 2 znaka'),
            kategorija: idPolje('Odaberite kategoriju'),
            vrijeme: z.coerce.number({ error: 'Vrijeme mora biti između 1 i 300 minuta'})
                .int('Vrijeme mora biti cijeli broj')
                .min(1, 'Vrijeme mora biti između 1 i 300 minuta')
                .max(300, 'Vrijeme mora biti između 1 i 300 minuta'),
            opis: z.string().trim().min(5, 'Opis recepta mora imati najmanje 5 znakova'),
            priprema: z.string().trim().default(''),
            sastojci: z.array(stavkaSastojkaSchema).min(1, 'Dodaj barem jedan sastojak u recept'),
            omiljen: z.boolean(),
            vegansko: z.boolean(),
        })

export const pretragaSchema = z.string().trim().min(3, 'Unesi najmanje 3 znaka za pretragu')

export const brojGeneriranjaSchema = (max) => {
    const poruka = `Unesi broj između 1 i ${max}.`
       return z.coerce.number({ error: poruka})
            .int(poruka)
            .min(1, poruka)
            .max(max, poruka)
}
export const jedinicaMjereSchema = z.object({
                naziv: z.string().trim()
                    .min(1, 'Unesite naziv jedinice mjere')
                    .max(50, 'Naziv jedinice mjere je predug')
            })

const MAX_VELICINA_SLIKE = 25 * 1024 * 1024

export const slikaDatotekaSchema = z.instanceof(File)
        .refine(d => d.type.startsWith('image/'), 'Odaberite datoteku slike')
        .refine(d => d.size <= MAX_VELICINA_SLIKE, 'Slika ne smije biti veća od 25 MB')
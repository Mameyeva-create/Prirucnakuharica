import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReceptService from "../../services/recepti/ReceptService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";
import KategorijaService from "../../services/kategorije/KategorijaService";
import SastojakService from "../../services/SastojakService";

export default function ReceptPromjena() {

    const navigate = useNavigate()
    const params = useParams()
    const [recept, setRecept] = useState({})
    const [omiljen, setOmiljen] = useState(false)
    const [vegansko, setVegansko] = useState(false)
    const [kategorije, setKategorije] = useState([])
    const [sviSastojci, setSviSastojci] = useState([])
    const [stavkeRecepta, setStavkeRecepta] = useState([])
    const [osnovnePorcije, setOsnovnePorcije] = useState(2)

    useEffect(() => {
        ucitajRecept()
        ucitajKategorije()
        ucitajSastojke()
    }, [])

    function pretvoriStariSastojak(tekst) {
        const rezultat = tekst.match(
            /^\s*(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|žlica|žličica)?\s+(.+)$/i
        )
        if (!rezultat) {
            return {
                naziv: tekst.trim(),
                kolicina: 1,
                jedinica: 'kom'
            }
        }
        return {
            kolicina: Number(rezultat[1].replace(',', '.')),
            jedinica: rezultat[2] || 'kom',
            naziv: rezultat[3].trim()
        }
    }

    async function ucitajKategorije() {
        try {
            const odgovor = await KategorijaService.get()
            setKategorije(odgovor.data)
        } catch (greska) {
            console.error('Greška pri učitavanju kategorija:', greska)
        }
    }

    async function ucitajSastojke() {
        try {
            const sastojci = SastojakService.get()
            setSviSastojci(sastojci)
        } catch (greska) {
            console.error('Greška pri učitavanju sastojka:', greska)
        }
    }

    async function ucitajRecept() {
        try {
            const odgovor = await ReceptService.getById(params.id)
            const i = odgovor.data

            if (!i) {
                console.error('Recept nije pronađen, ID:', params.id)
                navigate(RouteNames.RECEPTI)
                return
            }

            setRecept(i)
            setOmiljen(i.omiljen ?? false)
            setVegansko(i.vegansko ?? false)
            setOsnovnePorcije(i.osnovnePorcije || 2)
            // setStavkeRecepta(Array.isArray(i.sastojci) ? i.sastojci : [])
            const sastojciRecepta = Array.isArray(i.sastojci)
                ? i.sastojci : []
            // Učitavamo aktualni popis sastojaka iz localStorage
            const sviDostupniSastojci = SastojakService.get()
            setSviSastojci(sviDostupniSastojci)

            const noveStavke = sastojciRecepta.map((stavka) => {
                // Ako je sastojak već spremljen kao objekt
                if (typeof stavka === 'object' && stavka !== null) {
                    return {
                        sastojakId: stavka.sastojakId ?? '',
                        kolicina: stavka.kolicina ?? '',
                        jedinica: stavka.jedinica || 'g'
                    }
                }
                // Ako je sastojak stara tekstualna vrijednost
                const stari = pretvoriStariSastojak(stavka)
                let pronadeniSastojak = sviDostupniSastojci.find(
                    (sastojak) =>
                        sastojak.naziv.toLocaleLowerCase('hr') ===
                        stari.naziv.toLocaleLowerCase('hr')
                )
                if (!pronadeniSastojak && stari.naziv.trim()) {
                    pronadeniSastojak = SastojakService.dodaj(stari.naziv)
                    sviDostupniSastojci.push(pronadeniSastojak)
                }
                return {
                    sastojakId: pronadeniSastojak ? pronadeniSastojak.id : '',
                    kolicina: stari.kolicina,
                    jedinica: stari.jedinica
                }
            })
            setStavkeRecepta(noveStavke)

        } catch (greska) {
            console.error('Greška pri učitavanju recepta', greska)
            navigate(RouteNames.RECEPTI)
        }
    }

    async function promijeni(recept) {
        await ReceptService.promijeni(params.id, recept).then(() => {
            navigate(RouteNames.RECEPTI)
        })
    }

    function dodajStavku() {
        setStavkeRecepta([...stavkeRecepta, {
            sastojakId: "",
            kolicina: "",
            jedinica: "g"
        }
        ])
    }
    function obrisiStavku(index) {
        setStavkeRecepta(stavkeRecepta.filter((_, i) => i !== index))
    }
    function promijeniStavku(index, polje, vrijednost) {
        setStavkeRecepta(stavkeRecepta.map((stavka, i) =>
            i === index
                ? { ...stavka, [polje]: vrijednost }
                : stavka))
    }

    function odradiSubmit(e) {
        e.preventDefault()

        const podaci = new FormData(e.target)

        promijeni({
            naziv: podaci.get('naziv'),
            kategorija: podaci.get('kategorija'),
            vrijeme: parseInt(podaci.get('vrijeme')),
            opis: podaci.get('opis'),
            osnovnePorcije: Number(osnovnePorcije),
            sastojci: stavkeRecepta.map((stavka) => ({
                sastojakId: Number(stavka.sastojakId),
                kolicina: Number(stavka.kolicina),
                jedinica: stavka.jedinica
            })),
            omiljen: omiljen,
            vegansko: vegansko
        })
    }

    return (
        <>
            <h3>
                Promijeni recept
            </h3>
            <Form onSubmit={odradiSubmit}>

                <Form.Group controlId="naziv">
                    <Form.Label>Naziv recepta</Form.Label>
                    <Form.Control type="text"
                        name="naziv" required
                        defaultValue={recept.naziv} />
                </Form.Group>

                <Form.Group controlId="kategorija">
                    <Form.Label>Kategorija</Form.Label>
                    <Form.Select name="kategorija"
                        value={recept.kategorija || ""}
                        onChange={(e) => setRecept({
                            ...recept, kategorija: e.target.value
                        })
                        } required >
                        <option value="">-- Odaberi kategoriju --</option>
                        {recept.kategorija && !kategorije.some(
                            (kategorija) => kategorija.naziv === recept.kategorija
                        ) && (
                                <option value={recept.kategorija}>
                                    {recept.kategorija}</option>
                            )}
                        {kategorije.map((kategorija) => (
                            <option key={kategorija.id} value={kategorija.naziv}>
                                {kategorija.naziv}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="vrijeme">
                    <Form.Label>Vrijeme</Form.Label>
                    <Form.Control type="number"
                        name="vrijeme" step={1} required
                        defaultValue={recept.vrijeme} />
                </Form.Group>

                <h5 className="mt-4">Sastojci</h5>
                <Form.Group className="mb-3">
                    <Form.Label>Broj osnovnih porcija</Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        value={osnovnePorcije} onChange={(e) =>
                            setOsnovnePorcije(Number(e.target.value))
                        } required />
                </Form.Group>

                {stavkeRecepta.map((stavka, index) => (
                    <Row key={index} className="mb-3 align-items-end">
                        <Col md={5}>
                            <Form.Label>Sastojak</Form.Label>
                            <Form.Select value={stavka.sastojakId ?? ""}
                                onChange={(e) => promijeniStavku(
                                    index,
                                    "sastojakId",
                                    e.target.value === ""
                                        ? "" : Number(e.target.value)
                                )}
                                required
                            >
                                <option value="">-- Odaberi sastojak --</option>
                                {sviSastojci.map((sastojak) => (
                                    <option key={sastojak.id} value={sastojak.id}>{sastojak.naziv}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Label>Količina</Form.Label>
                            <Form.Control type="number"
                                min={0.01}
                                step="any"
                                value={stavka.kolicina ?? ""}
                                onChange={(e) => promijeniStavku(
                                    index,
                                    "kolicina",
                                    e.target.value
                                )}
                                required />
                        </Col>
                        <Col md={2}>
                            <Form.Label>Jedinica</Form.Label>
                            <Form.Select value={stavka.jedinica || "g"}
                                onChange={(e) => promijeniStavku(
                                    index,
                                    "jedinica",
                                    e.target.value
                                )}
                            >
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="kom">kom</option>
                                <option value="žlica">žlica</option>
                                <option value="žličica">žličica</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button type="button"
                                variant="danger"
                                onClick={() => obrisiStavku(index)}>
                                Obriši
                            </Button>
                        </Col>
                    </Row>
                ))}
                <Button type="button"
                    variant="outline-success"
                    className="mb-4"
                    onClick={dodajStavku}>
                    + Dodaj sastojak
                </Button>

                <Form.Group controlId="opis">
                    <Form.Label>Opis recepta</Form.Label>
                    <Form.Control as="textarea"
                        name="opis" rows={4} required
                        defaultValue={recept.opis} />
                </Form.Group>

                <Form.Group controlId="omiljen" className="mt-3">
                    <Form.Check label="Dodaj u omiljene ❤️"
                        name="omiljen"
                        checked={omiljen}
                        onChange={(e) => setOmiljen(e.target.checked)}
                    />
                </Form.Group>


                <Form.Group controlId="vegansko" className="mt-3">
                    <Form.Check label="Dodaj u vegansko 🌱"
                        name="vegansko"
                        checked={vegansko}
                        onChange={(e) => setVegansko(e.target.checked)}
                    />
                </Form.Group>

                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.RECEPTI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promijeni recept
                        </Button>
                    </Col>
                </Row>

            </Form>

        </>
    )
}

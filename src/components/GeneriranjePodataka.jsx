import { useState } from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap'
import { DATA_SOURCE, PrefixStorage } from '../constants'
import GeneriranjeJedinicaMjere from '../pages/jedinicaMjere/GeneriranjeJedinicaMjere'
import GeneriranjeSastojaka from '../pages/sastojci/GeneriranjeSastojaka'
import GeneriranjeKategorija from '../pages/kategorije/GeneriranjeKategorija'
import GeneriranjeRecepata from '../pages/recepti/GeneriranjeRecepata'
import GeneriranjeOperatera from '../pages/operateri/GeneriranjeOperatera'
import { kategorije } from '../services/kategorije/KategorijaPodaci'
import { jediniceMjere } from '../services/jedinicaMjere/JedinicaMjerePodaci'
import { sastojci } from '../services/sastojci/SastojakPodaci'
import { operateri } from '../services/operateri/OperaterPodaci'
import { recepti } from '../services/recepti/ReceptPodaci'
import OperaterServiceFirebase from '../services/operateri/OperaterServiceFirebase'
import KategorijaServiceFirebase from '../services/kategorije/KategorijaServiceFirebase'
import SastojakServiceFirebase from '../services/sastojci/SastojakServiceFirebase'
import ReceptServiceFirebase from '../services/recepti/ReceptServiceFirebase'
import JedinicaMjereServiceFirebase from '../services/jedinicaMjere/JedinicaMjereServiceFirebase'

const KARTICE = [
    GeneriranjeJedinicaMjere,
    GeneriranjeSastojaka,
    GeneriranjeKategorija,
    GeneriranjeRecepata,
    GeneriranjeOperatera,
]

export default function GeneriranjePodataka() {
    const [poruka, setPoruka] = useState(null)
    function presipaj() {
        if (!window.confirm('Presipati sve podatke iz memorije u localStorage? Postojeći podaci bit će zamijenjeni.')) {
            return
        }
        try {
            // Slike u base64 su velike (limit localStorage je oko 5 MB), pa se kopira samo putanja
            const receptiBezSlika = recepti.map(({ slikaBase64, ...ostalo }) => ostalo)

            localStorage.setItem('kategorije', JSON.stringify(kategorije))
            localStorage.setItem('jediniceMjere', JSON.stringify(jediniceMjere))
            localStorage.setItem('sastojci', JSON.stringify(sastojci))
            localStorage.setItem('operateri', JSON.stringify(operateri))
            localStorage.setItem('recepti', JSON.stringify(receptiBezSlika))

            setPoruka({ tip: 'success', tekst: 'Uspješno presipano!' })
        } catch (error) {
            setPoruka({ tip: 'danger', tekst: 'Greška pri presipavanju: ' + error.message })
        }
    }


    const handleMemorijaULocalStorage = async () => {
        if (!window.confirm('Jeste li sigurni da želite presipati sve podatke iz memorije u localStorage?')) {
            return;
        }

        setPoruka(null);

        try {

            localStorage.removeItem(PrefixStorage.JEDINICE_MJERE)
            localStorage.removeItem(PrefixStorage.KATEGORIJE)
            localStorage.removeItem(PrefixStorage.OPERATERI)
            localStorage.removeItem(PrefixStorage.RECEPTI)
            localStorage.removeItem(PrefixStorage.SASTOJCI)

            localStorage.setItem(PrefixStorage.JEDINICE_MJERE, JSON.stringify(jediniceMjere))
            localStorage.setItem(PrefixStorage.KATEGORIJE, JSON.stringify(kategorije))
            localStorage.setItem(PrefixStorage.RECEPTI, JSON.stringify(recepti))
            localStorage.setItem(PrefixStorage.OPERATERI, JSON.stringify(operateri))
             localStorage.setItem(PrefixStorage.SASTOJCI, JSON.stringify(sastojci))

           
            setPoruka({
                tip: 'success',
                tekst: `Uspješno presipano!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri presipavanju podataka: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };


    const handleMemorijaUFirebase = async () => {
    if (!window.confirm('Jeste li sigurni da želite pretočiti iz memorije u firebase?')) {
        return;
    }

    setPoruka(null);

    try {
        // 1. Operateri (idu paralelno jer ne trebamo njihove ID-ove za kasnije)
        const operateriPromises = operateri.map(e => {
            const { id, ...ostatak } = e;
            return OperaterServiceFirebase.dodajBezHash(ostatak);
        });
        await Promise.all(operateriPromises);


        // 2. Kategorije (trebamo nove ID-ove za recepte)
        let mapiranjeIdKategorija = [];
        for (const e of kategorije) {
            const { id, ...ostatak } = e;
            const fb = await KategorijaServiceFirebase.dodaj(ostatak);
            const noviId = fb.id; // Ovisno što vraća servis (fb.id ili fb.data.id)
            mapiranjeIdKategorija.push({ idm: id, idf: noviId });
        }


        // 3. Jedinice mjere (trebamo nove ID-ove za sastojke u receptima)
        let mapiranjeIdJedinicaMjere = [];
        for (const e of jediniceMjere) {
            const { id, ...ostatak } = e;
            const fb = await JedinicaMjereServiceFirebase.dodaj(ostatak);
            const noviId = fb.id;
            mapiranjeIdJedinicaMjere.push({ idm: id, idf: noviId });
        }


        // 4. Sastojci (trebamo nove ID-ove za sastojke u receptima)
        let mapiranjeIdSastojaka = [];
        for (const e of sastojci) {
            const { id, ...ostatak } = e;
            const fb = await SastojakServiceFirebase.dodaj(ostatak);
            const noviId = fb.id;
            mapiranjeIdSastojaka.push({ idm: id, idf: noviId });
        }


        // 5. Recepti (povezivanje starih ID-ova kategorije, sastojaka i jedinica mjere s novima)
        for (const e of recepti) {
            const { id, ...ostatak } = e;

            // Pronađi novi ID kategorije
            const mKategorija = mapiranjeIdKategorija.find(m => m.idm == ostatak.kategorija);
            ostatak.kategorija = mKategorija ? mKategorija.idf : null;

            // Mapiraj niz objekata sastojaka na nove ID-ove sastojaka i jedinica mjere
            ostatak.sastojci = ostatak.sastojci.map(s => {
                const mSastojak = mapiranjeIdSastojaka.find(m => m.idm == s.sastojak);
                const mJedMjere = mapiranjeIdJedinicaMjere.find(m => m.idm == s.jedMjere);

                return {
                    sastojak: mSastojak ? mSastojak.idf : null,
                    kolicina: s.kolicina,
                    jedMjere: mJedMjere ? mJedMjere.idf : null
                };
            }).filter(s => s.sastojak !== null && s.jedMjere !== null); // Makni neispravne unose ako nisu pronađeni

            await ReceptServiceFirebase.dodaj(ostatak);
        }

        setPoruka({
            tip: 'success',
            tekst: 'Uspješno presipano u Firebase'
        });

    } catch (error) {
        console.error("Greška pri presipanju:", error);
        setPoruka({
            tip: 'error',
            tekst: 'Došlo je do greške prilikom sinkronizacije.'
        });
    } finally {
    }
};

    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <h2 className="text-center mb-4">Generiranje podataka</h2>
            <Row className="g-4 align-items-stretch">
                {KARTICE.map((Kartica, i) => (
                    <Col xs={12} md={6} key={i}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body>
                                <Kartica />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {DATA_SOURCE.trim() === 'memorija' && (
                <>
                    <hr className="my-4" />
                    <h3>Presipavanje podataka</h3>
                    <p className="text-muted">
                        Kopira trenutne podatke iz memorije u localStorage.
                    </p>
                    <Button variant="danger" onClick={presipaj}>Presipaj</Button>
                    {poruka && (
                        <Alert variant={poruka.tip} className="mt-3">{poruka.tekst}</Alert>
                    )}
                </>
            )}


             {DATA_SOURCE==='memorija' && (<>
             <hr className="my-4" />

            <h3>Presipavanje podataka</h3>
            <p className="text-muted">
                Koristite ove opcije za kopiranje iz jednog izvora u drugi.
            </p>

            <Row className="mt-3">
                <Col md={6}>
                    <Button
                        variant="danger"
                        onClick={handleMemorijaULocalStorage}
                        className="w-100 mb-2"
                    >
                       Iz memorije u localStorage
                    </Button>
                </Col>
                <Col md={6}>
                            <Button
                                variant="danger"
                                onClick={handleMemorijaUFirebase}
                                className="w-100 mb-2"
                            >
                               Iz memorije u firebase
                            </Button>
                        </Col>
               
            </Row>
            </>)}   


            {/* Новый блок для Firebase */}
            {DATA_SOURCE.trim() === 'firebase' && (
                <>
                    <hr className="my-4" />
                    <h3>Firebase</h3>
                    <p className="text-muted">
                        Podaci se generiraju direktno u Firestore kroz kartice iznad.
                        Pazite da ne generirate iste podatke više puta.
                    </p>
                </>
            )}
        </div>
    )
}
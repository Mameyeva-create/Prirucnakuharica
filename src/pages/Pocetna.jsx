import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { GiCookingPot } from 'react-icons/gi';
import { MdKitchen, MdScale } from 'react-icons/md';
import ReceptService from '../services/recepti/ReceptService';
import KategorijaService from '../services/kategorije/KategorijaService';
import { BiCategory, BiLeaf } from 'react-icons/bi';
import SastojakService from '../services/sastojci/SastojakService'
import JedinicaMjereService from '../services/jedinicaMjere/JedinicaMjereService'
import { pretragaSchema, validiraj } from '../validacije';


export default function Pocetna() {
  const navigate = useNavigate()
  // const [trazi, setTrazi] = useState('')
  const [namirnice, setNamirnice] = useState('')
  const [brojGeneriranih, setBrojGeneriranih] = useState(0)
  const [brojGeneriranihKategorija, setBrojGeneriranihKategorija] = useState(0)
  const [brojGeneriranihSastojaka, setBrojGeneriranihSastojaka] = useState(0)
  const [brojGeneriranihJedinica, setBrojGeneriranihJedinica] = useState(0)
  const [recepti, setRecepti] = useState([])
  const galerijaRef = useRef(null)


  useEffect(() => {
    async function ucitajStatistiku() {
      try {
        const [odgovorRecepata, odgovorKategorija,
          odgovorSastojaka, odgovorJedinica
        ] = await Promise.all([
          ReceptService.get(),
          KategorijaService.get(),
          SastojakService.get(),
          JedinicaMjereService.get()
        ])
        const recepti = odgovorRecepata.data || []
        setRecepti(recepti)
        const kategorije = odgovorKategorija.data || []
        const sastojci = odgovorSastojaka.data || []
        const jedinice = odgovorJedinica.data || []

        setBrojGeneriranih(recepti.filter(recept => recept.generirano === true).length)
        setBrojGeneriranihKategorija(kategorije.filter(kategorija => kategorija.generirano === true).length)
        setBrojGeneriranihSastojaka(sastojci.filter(s => s.generirano === true).length)
        setBrojGeneriranihJedinica(jedinice.filter(j => j.generirano === true).length)
      } catch (error) {
        console.error('Greška pri učitavanju statistike:', error)
      }
    }
    ucitajStatistiku()
  }, [])


  function pretrazi(e) {
    e.preventDefault()
    const rezultat = validiraj(pretragaSchema, namirnice)
    if (!rezultat.ok) {
      alert(rezultat.greska)
      return
    }
    navigate(`/recepti?trazi=${encodeURIComponent(rezultat.data)}`)
  }

  function pomakniGaleriju(smjer) {
    const traka = galerijaRef.current

    if (!traka) return

    const stavka = traka.querySelector('.galerija-stavka')

    if (!stavka) return

    const sirina = stavka.offsetWidth + 16

    if (smjer === 1) {
      if (traka.scrollLeft + traka.clientWidth >= traka.scrollWidth - 5) {
        traka.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        traka.scrollBy({ left: sirina, behavior: 'smooth' })
      }
    } else {
      if (traka.scrollLeft <= 5) {
        traka.scrollTo({
          left: traka.scrollWidth,
          behavior: 'smooth'
        })
      } else {
        traka.scrollBy({ left: -sirina, behavior: 'smooth' })
      }
    }
  }
  return (
    <div className="pocetna">
      <div className='pocetna-gore' >
        <span className='hero-ime hero-red'>Priručna</span> {' '}
        <span className='hero-ime hero-green'>kuharica</span>
        <div className="hero-ukras">
          <svg className="hero-line" viewBox="0 0 80 14">
            <svg className="hero-line lijeva-linija" viewBox="0 0 80 14">
              <path d="M1 3 C18 13, 28 12, 42 6 S64 0, 79 10" />
            </svg>
          </svg>
          <span className="hero-heart">♥</span>

          <svg className="hero-line desna-linija" viewBox="0 0 80 14">
            <path d="M1 10 C15 0, 25 2, 38 7 S62 14, 79 3" />
          </svg>
        </div>
        <p className='hero-slogan'>Brzi i jednostavni recepti</p>
        <p className='hero-slogan'>za svaki dan.</p>
      </div>



      <div className="pocetna-kartice">
        <Row className="g-3 mt-2">

          <Col xs={12} md={6}>
            <Card className='pocetna-kartica h-100'>
              <Card.Body className='d-flex flex-column justify-content-center text-start  py-2 px-3'>
                <div className='pocetna-kartica-naslov align-items-center'>
                  <MdKitchen size={36} className='text-success' />
                  <h2>Namirnice koje imaš</h2>
                </div>
                <p className='pocetna-podnaslov'>Unesi namirnice koje imaš kod kuće ✍️</p>
                <Form onSubmit={pretrazi} className='d-flex flex-column gap-2'>
                  <Form.Control size='sm' type='text' placeholder='jaja, brašno, mlijeko'
                    value={namirnice} onChange={(e) =>
                      setNamirnice(e.target.value)}
                  />
                  <Button
                    type='submit' className='pocetna-gumb w-100'>
                    Pronađi recept
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="pocetna-kartica pocetna-statistika h-100">
              <Card.Body className="p-2 d-flex align-items-center">
                <Row className="g-0 text-center w-100">

                  {/* Recepti */}
                  <Col xs={6} md={3} className="stat-celija py-1 px-2">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <GiCookingPot size={40} className="mb-1 text-success" />
                      <div className="fs-5 fw-bold 1h-1">{brojGeneriranih}</div>
                      <div className="pocetna-statistika-tekst-mali">Generirani recepti</div>
                    </div>
                  </Col>

                  {/* Kategorije */}
                  <Col xs={6} md={3} className="stat-celija py-1 px-2">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <BiCategory size={36} className="mb-1 text-success" />
                      <div className="fs-5 fw-bold 1h-1">{brojGeneriranihKategorija}</div>
                      <div className="pocetna-statistika-tekst-mali">Generirane kategorije</div>
                    </div>
                  </Col>

                  {/* Sastojci */}
                  <Col xs={6} md={3} className="stat-celija py-1 px-2">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <BiLeaf size={36} className="mb-1 text-success" />
                      <div className="fs-5 fw-bold 1h-1">{brojGeneriranihSastojaka}</div>
                      <div className="pocetna-statistika-tekst-mali">Generirani sastojci</div>
                    </div>
                  </Col>

                  {/* Jedinice */}
                  <Col xs={6} md={3} className="stat-celija py-1 px-2">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <MdScale size={36} className="mb-1 text-success" />
                      <div className="fs-5 fw-bold 1h-1">{brojGeneriranihJedinica}</div>
                      <div className="pocetna-statistika-tekst-mali">Generirane jedinice</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>


      <div className="pocetna-galerija mt-4 px-3">
        <div className="d-flex justify-content-end gap-2 mb-3">
          <Button
            variant="outline-success"
            onClick={() => pomakniGaleriju(-1)}
            aria-label="Prethodne slike"
          >
            &#10094;
          </Button>

          <Button
            variant="outline-success"
            onClick={() => pomakniGaleriju(1)}
            aria-label="Sljedeće slike"
          >
            &#10095;
          </Button>
        </div>

        <div className="galerija-traka" ref={galerijaRef}>
          {recepti
            .filter(recept => recept.slikaBase64 || recept.slikaPutanja || recept.slika)
            .map(recept => (
              <div className="galerija-stavka" key={recept.id}>
                <Card
                  className="h-100"
                  onClick={() => navigate(`/recepti/${recept.id}/detalji`)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Img
                    variant="top"
                    src={recept.slikaBase64 || recept.slikaPutanja || recept.slika}
                    alt={recept.naziv}
                    className="galerija-slika"
                  />
                  <Card.Body className="text-center galerija-opis">
                    <Card.Title>{recept.naziv}</Card.Title>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      </div>


    </div>
  );

}





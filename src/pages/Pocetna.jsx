import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GiCookingPot } from 'react-icons/gi';
import { MdKitchen, MdScale } from 'react-icons/md';
import ReceptService from '../services/recepti/ReceptService';
import KategorijaService from '../services/kategorije/KategorijaService';
import { BiCategory, BiLeaf} from 'react-icons/bi';
import SastojakService from '../services/sastojci/SastojakService'
import JedinicaMjereService from '../services/jedinicaMjere/JedinicaMjereService'


export default function Pocetna() {
  const navigate = useNavigate()
  // const [trazi, setTrazi] = useState('')
  const [namirnice, setNamirnice] = useState('')
  const [brojGeneriranih, setBrojGeneriranih] = useState(0)
  const [brojGeneriranihKategorija, setBrojGeneriranihKategorija] = useState(0)
  const [brojGeneriranihSastojaka, setBrojGeneriranihSastojaka] = useState(0)
  const [brojGeneriranihJedinica, setBrojGeneriranihJedinica] = useState(0)


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

    const unos = namirnice.trim()

    if (unos.length < 3) {
      alert('Unesi najmanje 3 znaka za pretragu')
      return
    }

    navigate(`/recepti?trazi=${encodeURIComponent(unos)}`)
  }


  return (
    <>
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
        <Row className="g-3">

          <Col xs={12} md={6}>
            <Card className='pocetna-kartica h-100' style={{ minHeight: 'auto' }}>
              <Card.Body className='d-flex flex-column py-3'>
                <div className='pocetna-kartica-naslov'>
                  <MdKitchen size={36} />
                  <h2>Namirnice koje imaš</h2>
                </div>
                <p>Unesi namirnice koje imaš kod kuće</p>
                <Form onSubmit={pretrazi} className='mt-auto'>
                  <Form.Control type='text' placeholder='jaja, brašno, mlijeko'
                    value={namirnice} onChange={(e) =>
                      setNamirnice(e.target.value)}
                  />
                  <Button
                    type='submit' className='pocetna-gumb w-100 mt-3'>
                    Pronađi recept
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

        <Col xs={12} md={6}>
  <Card className="pocetna-kartica pocetna-statistika h-100">
    <Card.Body className="p-3">
      <Row className="g-0 text-center h-100">

        {/* Recepti */}
        <Col xs={6} className="py-3 px-2 border-end border-bottom">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <GiCookingPot size={32} className="mb-2 text-success" />
            <div className="fs-2 fw-bold lh-1">{brojGeneriranih}</div>
            <div className="small text-muted mt-1">Generirani recepti</div>
          </div>
        </Col>

        {/* Kategorije */}
        <Col xs={6} className="py-3 px-2 border-bottom">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <BiCategory size={32} className="mb-2 text-success" />
            <div className="fs-2 fw-bold lh-1">{brojGeneriranihKategorija}</div>
            <div className="small text-muted mt-1">Generirane kategorije</div>
          </div>
        </Col>

        {/* Sastojci */}
        <Col xs={6} className="py-3 px-2 border-end">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <BiLeaf size={32} className="mb-2 text-success" />
            <div className="fs-2 fw-bold lh-1">{brojGeneriranihSastojaka}</div>
            <div className="small text-muted mt-1">Generirani sastojci</div>
          </div>
        </Col>

        {/* Jedinice */}
        <Col xs={6} className="py-3 px-2">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <MdScale size={32} className="mb-2 text-success" />
            <div className="fs-2 fw-bold lh-1">{brojGeneriranihJedinica}</div>
            <div className="small text-muted mt-1">Generirane jedinice</div>
          </div>
        </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row >
      </div>
    </>
  );

}





import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import chefHat from '../../assets/slike/chef-hat.png'
import { GiCookingPot } from 'react-icons/gi';
import { MdKitchen } from 'react-icons/md';
import ReceptService from '../../services/recepti/ReceptService';



export default function Pocetna() {
  const navigate = useNavigate()
  const [trazi, setTrazi] = useState('')
  const [namirnice, setNamirnice] = useState('')
  const [brojGeneriranih, setBrojGeneriranih] = useState('')


  useEffect(() => {
    async function ucitajStatistiku() {
      try {
        const odgovor = await ReceptService.get()
        const recepti = odgovor.data || []

        setBrojGeneriranih(recepti.filter(recept => recept.generirano === true).length)
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
            <Card className='pocetna-kartica h-100'>
              <Card.Body className='d-flex flex-column'>
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
            <Card className='pocetna-kartica pocetna-statistika h-100'>
              <Card.Body className='pocetna-statistika-sadrzaj'>
                <div className="pocetna-statistika-tekst">
                  <GiCookingPot size={50} />
                  <h2>Statistika recepata</h2>
                  <div className='pocetna-statistika-broj'>
                    {brojGeneriranih}
                  </div>
                  <p>Ukupno generiranih recepata</p>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row >
      </div>
    </>
  );

}





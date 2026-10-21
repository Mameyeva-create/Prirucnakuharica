
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function Pocetna() {
  const navigate = useNavigate()
  const [trazi, setTrazi] = useState('')

  function pretrazi(e) {
    e.preventDefault()

    const unos = trazi.trim()

    if (unos.trim().length < 3) {
      alert('Unesi najmanje 3 znaka za pretragu')
      return
    }

    navigate(`/recepti?trazi=${encodeURIComponent(unos)}`)
  }

  return (
    <>
      <div className='pocetna-gore'>
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
      <Row style={{marginRight: '0px', marginLeft: '0px'}}>
        <Col>
        <Form className='pretraga-forma'
              onSubmit={pretrazi} >
              <Form.Control type='search' placeholder='Unesi namirnicu...'
                value={trazi} onChange={(e) =>
                  setTrazi(e.target.value)
                }
              />
              <Button
                type='submit' >
                Pronađi recept
              </Button>
            </Form>
        </Col>
        
      </Row>
    </>
  );

}





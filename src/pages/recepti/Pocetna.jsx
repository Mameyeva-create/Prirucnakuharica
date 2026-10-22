
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReceptService from '../../services/recepti/ReceptService';
import { MdKitchen } from 'react-icons/md';
import { GiCookingPot } from 'react-icons/gi';
import statistikaKuhanja from '../../assets/slike/statistika-kuhanja.png'

import hladnjak1 from '../../assets/slike/hladnjak1.png';
import hladnjak2 from '../../assets/slike/hladnjak2.png'
import chefHat from '../../assets/slike/chef-hat.png'


export default function Pocetna() {
  const navigate = useNavigate()

  const [trazi, setTrazi] = useState('')

  function pretrazi(e) {
    e.preventDefault()

    const unos = trazi.trim()

    if (unos.length < 3) {
      alert('Unesi najmanje 3 znaka za pretragu')
      return
    }

    navigate(`/recepti?trazi=${encodeURIComponent(unos)}`)
  }

  return (
    <>
      <div className='pocetna-gore'>
        <span className='hero-ime hero1'>Priručna</span> {' '}
        <span className='hero-ime hero2'>kuharica</span>
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


      <Row style={{ marginRight: '0px', marginLeft: '0px' }}>
        <Col className='dolje-lijevo'>
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
        <Col className='dolje-desno'>
          Desno
        </Col>


      </Row >

    </>
  );
}





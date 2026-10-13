
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import hladnjak1 from '../../assets/slike/hladnjak1.png';
import hladnjak2 from '../../assets/slike/hladnjak2.png'
import { useState } from 'react';
import { RouteNames } from '../../constants';
import chefHat from '../../assets/slike/chef-hat.png'


export default function Pocetna() {
  const navigate = useNavigate()
  const [trazi, setTrazi] = useState('')

  function pretrazi(e) {
    e.preventDefault()

    const unos = trazi.trim()

    if (unos.length < 2) {
      alert('Unesi najmanje 2 znaka za pretragu')
      return
    }

    navigate(`/recepti?trazi=${encodeURIComponent(unos)}`)
  }


  return (
    <>
      <div className='hero-banner'>

        <div className="hero-naslov">
          <img src={chefHat} alt="Kuharska kapa"
            className='hero-kapa' />

          <h1 className='hero-ime'>
            <span className='hero-red'>Priručna</span> {' '}
            <span className='hero-green'>kuharica</span>
          </h1>

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
      </div>
      <section className='hladnjak-sekcija'>
        <div className='hladnjak-grid'>

          <div>
            <img src={hladnjak2} alt="Namirnice u hladnjaku" />

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
          </div>

          {/* Desna slika */}
          <div>
            <img src={hladnjak1} alt='Priprema hrane' />
          </div>
        </div>
      </section>
      <Link to={RouteNames.KATEGORIJE}>Kategorije</Link>
    </>
  );

}





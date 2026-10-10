
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import hladnjak1 from '../../assets/slike/hladnjak1.png';
import hladnjak2 from '../../assets/slike/hladnjak2.png'
import { useState } from 'react';



export default function Pocetna() {
  const navigate = useNavigate()
  const [trazi, setTrazi] = useState('')

  function pretrazi(e) {
    e.preventDefault()

    const unos = trazi.trim()

    if (unos.length <2) {
      alert('Unesi najmanje 2 znaka za pretragu')
      return
    }

    navigate(`/recepti?trazi=${encodeURIComponent(unos)}`)
  }


  return (
    <>
      <div className='hero-banner'>
        {/* <div className="pocetna">
      </div> */}
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
    </>
  );

}





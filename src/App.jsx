import { useState } from 'react'
import './App.css'
import RecipeCard from './components/RecipeCard'
import recepti from './data/recepti'

function App() {
  const [odabraniRecept, setOdabraniRecept] = useState(null)
  const [pretraga, setPretraga] = useState('')

  const filtriraniRecepti = recepti.filter(recept) => recept.naziv.toLowerCase().includes(pretraga.toLowerCase())
)
  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a className='navbar-brand d-flex align-items-center' href="#">
            <img src="/slike/chef-hat.png" alt="Chef hat" className='chef-icon' />
            <span>Priručna kuharica</span>
          </a>
          <div className="d-flex gap-2">
            <a className="nav-link text-white" href="#">Početna</a>
            <a className='nav-link text-white' href="#">Recepti</a>
            <a className='nav-link text-white' href="#">❤️ Omiljeni</a>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        <h1 className='text-center mb-2'>Moji recepti</h1>
        <p className='text-center text-muted mb-5'>Brzi i jednostavni recepti za svaki dan.</p>
<div className='mb-5'>
  <input type="text"
  className='form-control'
  placeholder='🔍 Pretraži recept...'
  value={pretraga}
  onChange={(e) => setPretraga(e.target.value)} />
</div>

        <div className="row g-4">
          {filtriraniRecepti.map((recept) => (
            <div className='col-md-4' key={recept.id}>
              <RecipeCard recept={recept} onView={() => setOdabraniRecept(recept)}
              />
            </div>
          ))}
        </div>
      </main >
      {odabraniRecept && (
        <div className='modal d-block' tabIndex="-1">
          <div className='modal-dialog modal-lg modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h2 className='modal-title'>{odabraniRecept.naziv}</h2>
                <button type='button' className='btn-close' onClick={() => setOdabraniRecept(null)}
                ></button>
              </div>
              <div className='modal-body'>
                <img src={odabraniRecept.slika}
                  alt={odabraniRecept.naziv}
                  className='img-fluid rounded mb-4 recipe-detail-image' />
                <p>{odabraniRecept.opis}</p>
                <p><strong>Kategorija:</strong>{' '}
                  {odabraniRecept.kategorija} </p>
                <p>
                  <strong>Vrijeme:</strong>{' '}
                  {odabraniRecept.vrijeme} min
                </p>
                <h4>Sastojci:</h4>
                <ul>
                  {odabraniRecept.sastojci.map((sastojak, index) => (
                    <li key={index}>{sastojak}</li>
                  ))}
                </ul>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary' onClick={() => setOdabraniRecept(null)}>Zatvori</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
export default App
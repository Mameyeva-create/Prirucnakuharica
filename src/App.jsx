import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import ReceptPregled from './pages/recepti/ReceptPregled'
import ReceptNovi from './pages/recepti/ReceptNovi'
import Omiljeni from './pages/recepti/Omiljeni'
import Pocetna from './pages/recepti/Pocetna'
import ReceptPromjena from './pages/recepti/ReceptPromjena'
import ReceptDetalji from './pages/recepti/ReceptDetalji'
import KategorijaPregled from './pages/kategorije/KategorijaPregled'
import KategorijaNovi from './pages/kategorije/KategorijaNovi'
import KategorijaPromjena from './pages/kategorije/KategorijaPromjena'
import SastojakNovi from './pages/sastojci/SastojakNovi'
import GeneriranjeRecepta from './pages/recepti/GeneriranjeRecepta'
import GeneriranjePodataka from './components/GeneriranjePodataka'

function App() {



  return (
    <div className='d-flex flex-column min-vh-100'>

      <Izbornik />

      <Container fluid className='app'>
        <main>
          <Routes>
            <Route path={RouteNames.HOME} element={<Pocetna />} />

            <Route path={RouteNames.RECEPTI} element={<ReceptPregled />} />

            <Route path={RouteNames.RECEPTI_NOVI} element={<ReceptNovi />} />

            <Route path={RouteNames.OMILJENI} element={<Omiljeni />} />

            <Route path={RouteNames.RECEPTI_PROMJENA} element={<ReceptPromjena />} />

            <Route path={RouteNames.RECEPTI_GENERIRANJE} element={<GeneriranjePodataka />} />

            <Route path="/recepti/:id/detalji" element={<ReceptDetalji />} />

            <Route path={RouteNames.KATEGORIJE} element={<KategorijaPregled />} />

            <Route path={RouteNames.KATEGORIJE_NOVI} element={<KategorijaNovi />} />

            <Route path={RouteNames.KATEGORIJE_PROMJENA} element={<KategorijaPromjena />} />

            <Route path={RouteNames.SASTOJCI} element={}

            <Route path='/sastojci/novi' element={<SastojakNovi />} />

          </Routes>
        </main>
      </Container>

      <footer>
        <hr />
        &copy; {IME_APLIKACIJE} ({DATA_SOURCE})
      </footer>
    </div>
  )
}
export default App
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import ReceptPregled from './pages/recepti/ReceptPregled'
import ReceptNovi from './pages/recepti/ReceptNovi'
import Omiljeni from './pages/recepti/Omiljeni'
import Pocetna from './pages/Pocetna'
import ReceptPromjena from './pages/recepti/ReceptPromjena'
import ReceptDetalji from './pages/recepti/ReceptDetalji'
import KategorijaPregled from './pages/kategorije/KategorijaPregled'
import KategorijaNovi from './pages/kategorije/KategorijaNovi'
import KategorijaPromjena from './pages/kategorije/KategorijaPromjena'
import SastojakNovi from './pages/sastojci/SastojakNovi'
import GeneriranjePodataka from './components/GeneriranjePodataka'
import SastojakPregled from './pages/sastojci/SastojakPregled'
import SastojakPromjena from './pages/sastojci/SastojakPromjena'
import JedinicaMjerePregled from './pages/jedinicaMjere/JedinicaMjerePregled'
import JedinicaMjereNovi from './pages/jedinicaMjere/JedinicaMjereNovi'
import JedinicaMjerePromjena from './pages/jedinicaMjere/JedinicaMjerePromjena'
import OperaterPregled from './pages/operateri/OperaterPregled'
import OperaterNovi from './pages/operateri/OperaterNovi'
import OperaterPromjena from './pages/operateri/OperaterPromjena'
import OperaterPromjenaLozinke from './pages/operateri/OperaterPromjenaLozinke'
import { AuthProvider } from './context/AuthContext'
import Prijava from './pages/prijava/Prijava'
import ZasticenaRuta from './components/ZasticenaRuta'

function App() {



  return (
    <AuthProvider>
      <div className='d-flex flex-column min-vh-100'>

        <Izbornik />

        <Container fluid className='app'>
          <main>
            <Routes>
              <Route path={RouteNames.HOME} element={<Pocetna />} />
              <Route path={RouteNames.PRIJAVA} element={<Prijava />} />
              <Route path={RouteNames.RECEPTI} element={<ReceptPregled />} />
              <Route path={RouteNames.RECEPTI_NOVI} element={<ReceptNovi />} />
              <Route path={RouteNames.OMILJENI} element={<Omiljeni />} />
              <Route path={RouteNames.RECEPTI_PROMJENA} element={<ReceptPromjena />} />
              <Route path="/recepti/:id/detalji" element={<ReceptDetalji />} />
              <Route path={RouteNames.KATEGORIJE} element={<KategorijaPregled />} />
              <Route path={RouteNames.KATEGORIJE_NOVI} element={<KategorijaNovi />} />
              <Route path={RouteNames.KATEGORIJE_PROMJENA} element={<KategorijaPromjena />} />
              <Route path={RouteNames.SASTOJCI} element={<SastojakPregled />} />
              <Route path={RouteNames.SASTOJAK_PROMJENA} element={<SastojakPromjena />} />
              <Route path='/sastojci/novi' element={<SastojakNovi />} />
              <Route path={RouteNames.JEDINICE_MJERE} element={<JedinicaMjerePregled />} />
              <Route path={RouteNames.JEDINICE_MJERE_NOVI} element={<JedinicaMjereNovi />} />
              <Route path={RouteNames.JEDINICE_MJERE_PROMJENA} element={<JedinicaMjerePromjena />} />
              <Route path={RouteNames.OPERATERI} element={<ZasticenaRuta samoAdmin><OperaterPregled /></ZasticenaRuta>} />
              <Route path={RouteNames.OPERATERI_NOVI} element={<ZasticenaRuta samoAdmin><OperaterNovi /></ZasticenaRuta>} />
              <Route path={RouteNames.OPERATERI_PROMJENA} element={<ZasticenaRuta samoAdmin><OperaterPromjena /></ZasticenaRuta>} />
              <Route path={RouteNames.OPERATERI_PROMJENA_LOZINKE} element={<ZasticenaRuta samoAdmin><OperaterPromjenaLozinke /></ZasticenaRuta>} />
              <Route path={RouteNames.GENERIRANJE_PODATAKA} element={<ZasticenaRuta samoAdmin><GeneriranjePodataka /></ZasticenaRuta>} />

            </Routes>
          </main>
        </Container>

        <footer>
          <hr />
          &copy; {IME_APLIKACIJE} ({DATA_SOURCE})
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
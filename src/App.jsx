import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes, Navigate } from 'react-router-dom'
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
import MojProfil from './pages/operateri/MojProfil'
import MojaLozinka from './pages/operateri/MojaLozinka'

function App() {



  return (
    <AuthProvider>
      <div className='d-flex flex-column min-vh-100'>

        <Izbornik />

        <Container fluid className='app'>
          <main>
            <Routes>
              {/* Javno: samo pregled */}
              <Route path={RouteNames.HOME} element={<Pocetna />} />
              <Route path={RouteNames.PRIJAVA} element={<Prijava />} />
              <Route path={RouteNames.RECEPTI} element={<ReceptPregled />} />
              <Route path="/recepti/:id/detalji" element={<ReceptDetalji />} />
              <Route path={RouteNames.KATEGORIJE} element={<KategorijaPregled />} />
              <Route path={RouteNames.SASTOJCI} element={<SastojakPregled />} />
              <Route path={RouteNames.JEDINICE_MJERE} element={<JedinicaMjerePregled />} />

              {/* Prijavljeni korisnici: dodavanje i promjena */}
              <Route path={RouteNames.RECEPTI_NOVI} element={<ZasticenaRuta><ReceptNovi /></ZasticenaRuta>} />
              <Route path={RouteNames.RECEPTI_PROMJENA} element={<ZasticenaRuta><ReceptPromjena /></ZasticenaRuta>} />
              <Route path={RouteNames.OMILJENI} element={<ZasticenaRuta><Omiljeni /></ZasticenaRuta>} />
              <Route path={RouteNames.KATEGORIJE_NOVI} element={<ZasticenaRuta><KategorijaNovi /></ZasticenaRuta>} />
              <Route path={RouteNames.KATEGORIJE_PROMJENA} element={<ZasticenaRuta><KategorijaPromjena /></ZasticenaRuta>} />
              <Route path="/sastojci/novi" element={<ZasticenaRuta><SastojakNovi /></ZasticenaRuta>} />
              <Route path={RouteNames.SASTOJAK_PROMJENA} element={<ZasticenaRuta><SastojakPromjena /></ZasticenaRuta>} />
              <Route path={RouteNames.JEDINICE_MJERE_NOVI} element={<ZasticenaRuta><JedinicaMjereNovi /></ZasticenaRuta>} />
              <Route path={RouteNames.JEDINICE_MJERE_PROMJENA} element={<ZasticenaRuta><JedinicaMjerePromjena /></ZasticenaRuta>} />
              <Route path="/moj-profil" element={<ZasticenaRuta><MojProfil /></ZasticenaRuta>} />
              <Route path="/promjena-lozinke" element={<ZasticenaRuta><MojaLozinka /></ZasticenaRuta>} />

              {/* OPERATERI*, GENERIRANJE_PODATAKA: ZasticenaRuta samoAdmin */}
              <Route path={RouteNames.OPERATERI} element={<ZasticenaRuta samoAdmin><OperaterPregled /></ZasticenaRuta>} />
              <Route path={RouteNames.OPERATERI_NOVI} element={<ZasticenaRuta samoAdmin><OperaterNovi /></ZasticenaRuta>} />
              <Route path={RouteNames.OPERATERI_PROMJENA} element={<ZasticenaRuta samoAdmin><OperaterPromjena /></ZasticenaRuta>} />
              <Route path={RouteNames.OPERATERI_PROMJENA_LOZINKE} element={<ZasticenaRuta samoAdmin><OperaterPromjenaLozinke /></ZasticenaRuta>} />
              <Route path={RouteNames.GENERIRANJE_PODATAKA} element={<ZasticenaRuta samoAdmin><GeneriranjePodataka /></ZasticenaRuta>} />

              <Route path="*" element={<Navigate to={RouteNames.HOME} replace />} />

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
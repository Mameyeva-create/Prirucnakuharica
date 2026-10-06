import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
import './App.css'
import ReceptPregled from './pages/recepti/ReceptPregled'
import ReceptNovi from './pages/recepti/ReceptNovi'
import Omiljeni from './pages/recepti/Omiljeni'
import Pocetna from './pages/recepti/Pocetna'
import ReceptPromjena from './pages/recepti/ReceptPromjena'

function App() {



  return (
    <div className='d-flex flex-column min-vh-100'>
    {/* // <Container> */}
  
      <Izbornik />

      <Container className='app'>
        <main>
          <Routes>
            <Route path={RouteNames.HOME} element={<Pocetna />} />

            <Route path={RouteNames.RECEPTI} element={<ReceptPregled />} />

            <Route path={RouteNames.RECEPTI_NOVI} element={<ReceptNovi />} />

            <Route path={RouteNames.OMILJENI} element={<Omiljeni />} />

            <Route path={RouteNames.RECEPTI_PROMJENA} element={<ReceptPromjena />} />

            {/* <Route path={RouteNames.POCETNA} element={<Pocetna />} /> */}
          </Routes>
        </main>
      </Container>

      <footer>
        <hr />
        &copy; {IME_APLIKACIJE}
        {/* </Container> */}
      </footer>
      </div>
   
  )
}
export default App
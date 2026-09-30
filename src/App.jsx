import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import ReceptPregled from './pages/recepti/ReceptPregled'
import ReceptNovi from './pages/recepti/ReceptNovi'
import Omiljeni from './pages/recepti/Omiljeni'

function App() {



  return (
    <Container>
      <Izbornik />
      <Container className='app'>
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.RECEPTI} element={<ReceptPregled />} />
          
          <Route path={RouteNames.RECEPTI_NOVI} element={<ReceptNovi />} />

          <Route path={RouteNames.OMILJENI} element={<Omiljeni />} />
        </Routes>
      </Container>
      <hr />
      &copy; {IME_APLIKACIJE}
    </Container>
  )
}
export default App
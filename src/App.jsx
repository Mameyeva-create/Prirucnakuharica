import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import ReceptPregled from './pages/recepti/ReceptPregled'


function App() {



  return (
    <Container>
      <Izbornik />
      <Container className='app'>
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.RECEPTI} element={<ReceptPregled />} />
        </Routes>
      </Container>
      <hr />
      &copy; {IME_APLIKACIJE}
    </Container>
  )
}
export default App
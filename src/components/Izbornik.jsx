import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IME_APLIKACIJE, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';
import chefHat from '../assets/slike/chef-hat.png'
import { BiBookAdd } from 'react-icons/bi';

export default function Izbornik() {

    const navigate = useNavigate()

    return (
        <Navbar expand="lg" className="navbar-kuharica" variant='dark'>
            <Container fluid>
                <Navbar.Brand onClick={() => navigate(RouteNames.HOME)}
                    style={{ cursor: 'pointer' }}>
                    <img
                        src={chefHat}
                        alt='Chef hat'
                        width='42'
                        height='42'
                        className='me-2 chef-hat'
                    />
                    {IME_APLIKACIJE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={() => { navigate(RouteNames.HOME) }}
                        >Početna</Nav.Link>

                        <NavDropdown title="🍽️ Recepti" id="recepti-dropdown">
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI)}
                            >SVE</NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI + '?kategorija=Doručak')}
                            >🥗 Doručak</NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI + '?kategorija=Ručak')}
                            >🍲 Ručak</NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI + '?kategorija=Večera')}
                            >🍱 Večera</NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI + '?kategorija=Desert')}
                            >🧁 Desert</NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI + '?vegansko=true')}
                            >🌱 Vegansko</NavDropdown.Item>

                        </NavDropdown>

                        <NavDropdown title="❤️ Omiljeni" id="omiljeni-dropdown">
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.OMILJENI)}
                            > ❤️ Omiljeni </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title={
                        <>
                        <BiBookAdd color="white" size={20} />
                        {' '}Dodaj
                        </> }
                        id="dodaj-dropdown">
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI_NOVI)}
                            > Dodaj Svoj </NavDropdown.Item>
                        </NavDropdown>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>


    )
}
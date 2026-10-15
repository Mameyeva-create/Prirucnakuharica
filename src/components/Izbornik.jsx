import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IME_APLIKACIJE, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';
import chefHat from '../assets/slike/chef-hat.png'
import { BiBookAdd } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import KategorijaService from '../services/kategorije/KategorijaService';

export default function Izbornik() {

    const navigate = useNavigate()
    const [kategorije, setKategorie] = useState([])

    useEffect(() => {
        ucitajKategorije()
    }, [])

    async function ucitajKategorije() {
        try {
            const odgovor = await KategorijaService.get()
            setKategorie(odgovor.data)
        } catch (greska) {
            console.error('Greška pri učitavanju kategorija:', greska)
        }
    }

    return (
        <Navbar expand="lg" className="navbar-kuharica" variant='dark'>
            <Container fluid>
                <Navbar.Brand onClick={() => navigate(RouteNames.HOME)}
                    style={{ cursor: 'pointer' }}>
                    <img
                        src={chefHat}
                        alt='Chef hat'
                        width='40'
                        height='40'
                        className='me-2 chef-hat'
                    />
                    {IME_APLIKACIJE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                  {/* Справа: все пункты меню */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="jastify-content-end">
                        <Nav.Link
                            onClick={() => { navigate(RouteNames.HOME) }}
                        >Početna</Nav.Link>

                        {/* <Nav.Link
                            onClick={() => { navigate(RouteNames.KATEGORIJE) }}
                        >Kategorije</Nav.Link> */}

                        <NavDropdown title="🍽️ Recepti" id="recepti-dropdown">
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI)}
                            >SVE</NavDropdown.Item>

                            <NavDropdown.Divider />
                            {kategorije.map((kategorija) => (
                                <NavDropdown.Item key={kategorija.id}
                                    onClick={() => navigate(RouteNames.RECEPTI + '?kategorija='
                                        + encodeURIComponent(kategorija.naziv))
                                    }
                                >
                                    {kategorija.naziv === 'Doručak' && '🥞'}
                                    {kategorija.naziv === 'Ručak' && '🍲'}
                                    {kategorija.naziv === 'Večera' && '🍽️'}
                                    {kategorija.naziv === 'Desert' && '🧁'}
                                    {!['Doručak', 'Ručak', 'Večera', 'Desert']
                                        .includes(kategorija.naziv) && '🍴'}
                                    {' '}{kategorija.naziv}
                                </NavDropdown.Item>
                            ))}

                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI + '?vegansko=true')}>
                                🌱 Vegansko
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.KATEGORIJE)}>
                                📋 Sve kategorije
                            </NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.KATEGORIJE_NOVI)}>
                                ✏️ Dodaj svoju kategoriju
                            </NavDropdown.Item>

                            {/* <NavDropdown.Item
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

                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.KATEGORIJE)}
                            >
                                📋 Sve kategorije
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.KATEGORIJE_NOVI)}
                            >
                                ✏️ Dodaj svoju kategoriju
                            </NavDropdown.Item> */}

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
                            </>}
                            id="dodaj-dropdown">
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI_NOVI)}
                            > Dodaj Svoj Recept </NavDropdown.Item>
                        </NavDropdown>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>


    )
}
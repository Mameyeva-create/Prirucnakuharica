import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { IME_APLIKACIJE, RouteNames } from '../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import chefHat from '../assets/slike/chef-hat.png'
import { BiBookAdd, BiHeart, BiHomeAlt, BiRestaurant } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import KategorijaService from '../services/kategorije/KategorijaService';

export default function Izbornik() {

    const navigate = useNavigate()
    const location = useLocation()

    const [kategorije, setKategorie] = useState([])
    const [prikaziKategorije, setPrikaziKategorije] = useState(false)
    const [receptiOtvoreni, setReceptiOtvoreni] = useState(false)

    useEffect(() => {
        ucitajKategorije()

        const handleFocus = () => {
            ucitajKategorije()
        }
        window.addEventListener('focus', handleFocus)
        return () => {
            window.removeEventListener('focus', handleFocus)
        }
    }, [location.pathname])

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
                    <Nav className="ms-lg-auto align-items-lg-center text-end">
                        <Nav.Link
                            onClick={() => { navigate(RouteNames.HOME) }} >
                            <BiHomeAlt color='#e9b88b' size={20} className='me-2' />
                            Početna</Nav.Link>

                        <NavDropdown title={
                            <>
                                <BiRestaurant color='#e9b88b' size={20} className='me-2' />
                                Recepti
                            </>
                        }
                            id="recepti-dropdown"
                            show={receptiOtvoreni}
                            onToggle={(isOpen) => setReceptiOtvoreni(isOpen)}
                            autoClose='outside'
                        >
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI)}
                            >📖 Svi recepti</NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => {
                                    if (prikaziKategorije) {
                                        setPrikaziKategorije(false)

                                        setReceptiOtvoreni(false)
                                        navigate(RouteNames.KATEGORIJE)
                                    } else { setPrikaziKategorije(true) }
                                }} >
                                📋 Sve kategorije  {prikaziKategorije ? '▵' : '▿'}
                            </NavDropdown.Item>
                            {prikaziKategorije && (
                                <>
                                    <NavDropdown.Divider />
                                    {kategorije.map((kategorija) => (
                                        <NavDropdown.Item key={kategorija.id}
                                            onClick={() => {
                                                setPrikaziKategorije(false)
                                                setReceptiOtvoreni(false)
                                                navigate(RouteNames.RECEPTI + '?kategorija='
                                                    + encodeURIComponent(kategorija.naziv))
                                            }}
                                        >
                                            {kategorija.naziv === 'Doručak' && '🥪'}
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
                                        onClick={() => {
                                            setPrikaziKategorije(false)
                                            setReceptiOtvoreni(false)
                                            navigate(RouteNames.RECEPTI + '?vegansko=true')
                                        }}>
                                        🌱 Vegansko
                                    </NavDropdown.Item>

                                </>
                            )}

                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={() => {
                                    setPrikaziKategorije(false)
                                    setReceptiOtvoreni(false)
                                    navigate(RouteNames.JEDINICE_MJERE)
                                }}
                            >
                                ⚖️ Sve jedinice mjera
                            </NavDropdown.Item>
                            <NavDropdown.Item
                                onClick={() => {
                                    setPrikaziKategorije(false)
                                    setReceptiOtvoreni(false)
                                    navigate(RouteNames.SASTOJCI)
                                }}
                            >
                                🥕 Svi sastojci
                            </NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={() => {
                                    setPrikaziKategorije(false)
                                    setReceptiOtvoreni(false)
                                    navigate(RouteNames.RECEPTI_GENERIRANJE)
                                }}
                            >
                                🎲 Generiranje podataka
                            </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title={
                            <>
                                <BiHeart color='#e9b88b' size={20} className='me-2' />
                                Omiljeni
                            </>
                        }
                            id="omiljeni-dropdown">
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.OMILJENI)}
                            > ❤️ Omiljeni </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown align="end" title={
                            <>
                                <BiBookAdd color="#e9b88b" size={20} className='me-2' />
                                {' '}Dodaj
                            </>
                        } id="dodaj-dropdown">
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.RECEPTI_NOVI)}
                            > 🍲 Dodaj svoj Recept </NavDropdown.Item>

                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.KATEGORIJE_NOVI)}>
                                ✏️ Dodaj svoju kategoriju
                            </NavDropdown.Item>

                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => navigate("/sastojci/novi")}
                            > 🥕 Dodaj sastojak</NavDropdown.Item>

                            <NavDropdown.Item onClick={() => navigate(RouteNames.JEDINICE_MJERE_NOVI)}
                            > ⚖️ Dodaj jedinicu mjere</NavDropdown.Item>
                        </NavDropdown>

                    </Nav>
                </Navbar.Collapse >
            </Container >
        </Navbar >


    )
}
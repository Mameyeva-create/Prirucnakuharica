import { useEffect, useState } from "react"
import OperaterService from "../../services/operateri/OperaterService"
import { Table, Button } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { IME_APLIKACIJE, RouteNames } from "../../constants"
import { FaEdit, FaTrash, FaKey } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"



export default function OperaterPregled() {

    const navigate = useNavigate()
    const { prijavljeniOperater } = useAuth()
    const [searchParams] = useSearchParams()
    const [operateri, setOperateri] = useState([])
    const prikaziGenerirane = searchParams.get('generirani') === 'true'


    useEffect(() => { document.title = 'Operateri, ' + IME_APLIKACIJE }, [])

    useEffect(() => {
        ucitajOperatere()
    }, [])

    async function ucitajOperatere() {
        await OperaterService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setOperateri(odgovor.data)
        })
    }
    async function brisanje(id) {
        const operater = operateri.find(o => String(o.id) === String(id))
        const jeVlastitiRacun =
            String(id) === String(prijavljeniOperater?.id) ||
            operater?.email?.toLowerCase() === prijavljeniOperater?.email?.toLowerCase()

        if (jeVlastitiRacun) {
            alert('Ne možete obrisati vlastiti račun!')
            return
        }
        if (!confirm('Sigurno obrisati operatera?')) return

        const rezultat = await OperaterService.obrisi(id)
        if (rezultat.success) {
            ucitajOperatere()
        } else {
            alert(rezultat.message || 'Greška pri brisanju')
        }
    }
    const prikazaniOperateri = operateri.filter(o =>
        !prikaziGenerirane || o.generirano === true
    )
    return (
        <>
            <div className="naslov-recepti my-2 px-3 py-2">
                <h2>{prikaziGenerirane ? 'Generirani operateri' : 'Svi operateri'}</h2>
                <p className="mb-0">Pronađeno operatera: {prikazaniOperateri.length}</p>
            </div>
            {/* <Link to={RouteNames.OPERATERI_NOVI}
                className="btn btn-success w-100 my-3">
                Dodavanje novog operatera
            </Link> */}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Uloga</th>
                        <th className="text-center" style={{ width: '200px' }}>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {prikazaniOperateri.map((operater) => (
                        <tr key={operater.id}>
                            <td>{operater.email}</td>
                            <td>
                                <span className={`badge ${operater.uloga === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                    {operater.uloga}
                                </span>
                            </td>
                            <td className="text-center">
                                <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => navigate(`/operateri/${operater.id}`)}
                                        title="Promjeni email"
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => navigate(`/operateri/${operater.id}/lozinka`)}
                                        title="Promjeni lozinku"
                                    >
                                        <FaKey />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => brisanje(operater.id)}
                                        title="Obriši"
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {prikazaniOperateri.length === 0 && (
                        <tr>
                            <td colSpan={3} className="text-center">
                                {prikaziGenerirane ? 'Nema generiranih operatera' : 'Nema operatera'}
                            </td>
                        </tr>
                    )}
                </tbody>

            </Table>
        </>
    )
}

import { useId, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function GeneratorKartica({
    naslov,
    labelBroj,
    pocetniBroj = 5,
    max = 1000,
    putanjaPrikaza,
    tekstGeneriraj,
    tekstPrikaza,
    tekstBrisanja,
    potvrdaBrisanja,
    generiraj,   // async (broj) => string poruka
    obrisi,      // async () => string poruka
}) {
    const navigate = useNavigate()
    const id = useId()
    const [broj, setBroj] = useState(String(pocetniBroj))
    const [poruka, setPoruka] = useState('')
    const [greska, setGreska] = useState(false)
    const [radi, setRadi] = useState(false)

    async function pokreni(radnja) {
        setRadi(true)
        setPoruka('')
        setGreska(false)
        try {
            setPoruka(await radnja())
        } catch (error) {
            console.error(error)
            setGreska(true)
            setPoruka(error.message || String(error))
        } finally {
            setRadi(false)
        }
    }

    function klikGeneriraj() {
        const n = Number(broj)
        if (!Number.isInteger(n) || n < 1 || n > max) {
            setGreska(true)
            setPoruka(`Unesi broj između 1 i ${max}.`)
            return
        }
        pokreni(() => generiraj(n))
    }

    function klikObrisi() {
        if (!window.confirm(potvrdaBrisanja)) return
        pokreni(obrisi)
    }

    return (
        <div className="p-3">
            <h4>{naslov}</h4>

            <Form.Group className="mb-3" controlId={id}>
                <Form.Label>{labelBroj}</Form.Label>
                <Form.Control
                    type="number" min="1" max={max} step="1"
                    value={broj}
                    onChange={e => setBroj(e.target.value)}
                    disabled={radi}
                />
                <Form.Text muted>Unesi željeni broj od 1 do {max}.</Form.Text>
            </Form.Group>

            <div className="d-flex flex-column gap-2">
                <Button variant="success" onClick={klikGeneriraj} disabled={radi}>
                    {radi ? 'Radim...' : tekstGeneriraj}
                </Button>
                <Button variant="outline-success" onClick={() => navigate(putanjaPrikaza)} disabled={radi}>
                    {tekstPrikaza}
                </Button>
                <Button variant="outline-danger" onClick={klikObrisi} disabled={radi}>
                    {tekstBrisanja}
                </Button>
            </div>

            {poruka && (
                <Alert variant={greska ? 'danger' : 'success'} className="mt-3 mb-0">
                    {poruka}
                </Alert>
            )}
        </div>
    )
}
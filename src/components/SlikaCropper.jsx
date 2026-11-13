import { useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { slikaDatotekaSchema, validiraj } from '../validacije'

export default function SlikaCropper({ slika, onPromjena }) {
    const [izvor, setIzvor] = useState(null)   // slika koja se trenutno obrezuje
    const cropperRef = useRef(null)
    const inputRef = useRef(null)

    function zatvori() {
        setIzvor(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    function odaberi(e) {
        const datoteka = e.target.files[0]
        if (!datoteka) return

        const rezultat = validiraj(slikaDatotekaSchema, datoteka)
        if (!rezultat.ok) {
            alert(rezultat.greska)
            zatvori()
            return
        }
        const citac = new FileReader()
        citac.onload = () => setIzvor(citac.result)
        citac.onerror = () => alert('Greška pri učitavanju slike')
        citac.readAsDataURL(datoteka)
    }

    function primijeni() {
        const cropper = cropperRef.current?.cropper
        if (!cropper) return
        const canvas = cropper.getCroppedCanvas({
            maxWidth: 800,
            maxHeight: 600,
            fillColor: '#fff',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        })
        if (!canvas) return
        onPromjena(canvas.toDataURL('image/jpeg', 0.8))
        zatvori()
    }

    function ukloni() {
        onPromjena('')
        zatvori()
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label>Fotografija recepta 📷</Form.Label>
            <Form.Control
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={odaberi}
            />

            {izvor && (
                <div className="mt-3">
                    <Cropper
                        src={izvor}
                        ref={cropperRef}
                        style={{ height: 300, width: '100%' }}
                        aspectRatio={4 / 3}
                        viewMode={1}
                        autoCropArea={1}
                        guides={true}
                        background={false}
                        responsive={true}
                        checkOrientation={false}
                    />
                    <div className="d-flex gap-2 mt-2">
                        <Button type="button" variant="success" size="sm" onClick={primijeni}>
                            Primijeni isječak
                        </Button>
                        <Button type="button" variant="outline-secondary" size="sm" onClick={zatvori}>
                            Odustani
                        </Button>
                    </div>
                </div>
            )}

            {!izvor && slika && (
                <div className="mt-3">
                    <img
                        src={slika}
                        alt="Pregled fotografije recepta"
                        style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <Button type="button" variant="outline-danger" size="sm" className="mt-2" onClick={ukloni}>
                        Ukloni fotografiju
                    </Button>
                </div>
            )}
        </Form.Group>
    )
}
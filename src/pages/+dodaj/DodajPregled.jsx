import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import DodajService from "../../services/+dodaj/DodajService"
import { Link } from "react-router-dom"
import { RouteNames } from "../../constants"


export default function DodajPregled(){

const [recepti, setRecepti] = useState([])
useEffect(()=>{
    console.log('Dosla na pregled recepta')
    ucitajRecepti()
},[])

async function ucitajRecepti(){
    await DodajService.get().then((odgovor)=>{
        // console.table(odgovor.data)
        setRecepti(odgovor.data)
    })
}

    return (
        <>

        <Link to={RouteNames.DODAJ_NOVI}
        className="btn btn-success w-100 my-3">
           Dodavanje svog recepta
</Link>
            <Table hover  striped>
                <thead>
                    <th>Naziv</th>
                    <th>Kategorija</th>
                    <th>Vrijeme</th>
                    <th>Opis</th>
                </thead>
                <tbody>
                    {recepti && recepti.map((recept)=>(
                        <tr key={recept.id}>
                            <td>{recept.naziv}</td>
                            <td>{recept.kategorija}</td>
                            <td>{recept.vrijeme}</td>
                            <td>{recept.opis}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
            {/* {JSON.stringify(recept,null,2)} */}
        </>
    )
}
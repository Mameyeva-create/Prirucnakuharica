import { useEffect, useState } from "react"
import ReceptService from "../../services/recepti/ReceptService"
import { Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import { RouteNames } from "../../constants"


export default function ReceptPregled() {

const [recepti, setRecepti] = useState([])
useEffect(()=>{
    // console.log('Dosla na pregled recepta')
    ucitajRecepti()
},[])

async function ucitajRecepti(){
    await ReceptService.get().then((odgovor)=>{
        // console.table(odgovor.data)
        setRecepti(odgovor.data)
    })
}

    return (
        <>
           <Link to={RouteNames.RECEPTI_NOVI}
           className="btn btn-success w-100 my-3">
            Ovdje Pretraži recept
           </Link>
            <Table hover striped>
                <thead>
                    <th>Naziv</th>
                    <th>Kategorija</th>
                    <th>Vrijeme</th>
                    <th>Opis</th>
                    <th>Omiljen</th>
                </thead>
                <tbody>
                    {recepti && recepti.map((recept)=>(
                        <tr key={recept.id}>
                            <td className="lead">{recept.naziv}</td>
                            <td>{recept.kategorija}</td>
                            <td className="text-end">{recept.vrijeme} min</td>
                            <td>{recept.opis}</td>
                            <td>
                                {recept.omiljen ? '❤️' : ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>   
            
            {/* {JSON.stringify(recept,null,2)} */}
        </>
    )
}
import { useEffect, useState } from "react"
import ReceptService from "../../services/recepti/ReceptService"
import { Table } from "react-bootstrap"


export default function ReceptPregled(){

const [recepti, setRecepti] = useState([])
useEffect(()=>{
    console.log('Dosla na pregled recepta')
    ucitajRecepti()
},[])

async function ucitajRecepti(){
    await ReceptService.get().then((odgovor)=>{
        
        setRecepti(odgovor.data)
    })
}

    return (
        <>
           
            <Table hover striped>
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
            
            
        </>
    )
}
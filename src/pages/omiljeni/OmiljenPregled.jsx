import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import OmiljenService from "../../services/omiljeni/OmiljenService"


export default function OmiljenPregled(){

const [recepti, setRecepti] = useState([])
useEffect(()=>{
    console.log('Dosla na pregled recepta')
    ucitajRecepti()
},[])

async function ucitajRecepti(){
    await OmiljenService.get().then((odgovor)=>{
        // console.table(odgovor.data)
        setRecepti(odgovor.data)
    })
}

    return (
        <>
           
            {/* <Table hover striped>
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
            </Table> */}
            
            {/* {JSON.stringify(recept,null,2)} */}
        </>
    )
}
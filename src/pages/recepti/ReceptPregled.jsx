import { useEffect, useState } from "react"
import ReceptiService from "../../services/recepti/ReceptiService"


export default function ReceptPregled(){

const [recepti, setRecepti] = useState([])
useEffect(()=>{
    console.log('Dosla na pregled recepta')
    ucitajRecepti()
},[])

async function ucitajRecepti(){
    await ReceptiService.get().then((odgovor)=>{
        
        setRecepti(odgovor.data)
    })
}

    return (
        <>
            Ovdje dođe pregled recepata
            <hr />
            {JSON.stringify(recepti,null,3)}
        </>
    )
}
import { recepti } from "./ReceptPodaci"

async function get(){
    return {data: [...recepti]}
}

async function getById(id){
    return {data: recepti.find(i => i.id === parseInt(id))}
}

async function dodaj(recept){
    if(recepti.length===0){
        recept.id = 1
    } else {
        recept.id = recepti[recepti.length-1].id + 1
    }
    recepti.push(recept)
}

async function promijeni(id,recept){
    const index = nadiIndex(id)
    recepti[index] = {...recepti[index],...recept}
}

function nadiIndex(id){
    return recepti.findIndex(i => i.id === parseInt(id))
}


export default{
    get,
    dodaj,
    getById,
    promijeni
}
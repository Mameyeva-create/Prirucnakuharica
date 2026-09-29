import { recepti } from "./OmiljenPodaci"


async function get(){
    return {data: [...recepti]}
}
async function dodaj(recept){
    if(recepti.length===0){
        recept.id = 1
    } else {
        recept.id = recepti[recepti.length-1].id + 1
    }
    recepti.push(recepti)
}

export default{
    get,
    dodaj
}
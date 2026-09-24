import { recepti } from "./ReceptPodaci"


async function get(){
    return {data: [...recepti]}
}

export default{
    get
}
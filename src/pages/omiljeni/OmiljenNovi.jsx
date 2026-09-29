import { use } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import OmiljenService from "../../services/omiljeni/OmiljenService";

export default function OmiljenNovi() {

    const navigate = useNavigate()

    async function dodaj(recept) {
        await OmiljenService.dodaj(recept).then(() => {
            navigate(RouteNames.OMILJENI)
        })
    }
    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            kategorija: podaci.get('kategorija'),
            vrijeme: parseInt(podaci.get('vrijeme')),
            opis: podaci.get('opis')
        })
    }

    return (
    <>
            <h3>
               DODAJ  ❤️ OMILJEN RECEPT
            </h3>


            </>
            )
}

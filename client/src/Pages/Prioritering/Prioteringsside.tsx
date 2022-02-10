import { useState } from "react";
import { useEffect } from "react";
import { hentFilterverdier } from "../../api/lydia-api";
import { Filterverdier } from "../../domenetyper";
import Filtervisning from "./Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";

const Prioriteringsside = () => {
    const [filterverdier, setFilterverdier] = useState<Filterverdier>({
        fylker: [],
        kommuner : []
    });

    useEffect(() => {
        hentFilterverdier()
        .then(response => {
            if (response.isOk()){
                setFilterverdier(response.hentData() as Filterverdier)
            }
        })
    }, [])
    
    return <>
        <Filtervisning {...filterverdier} />
        <PrioriteringsTabell/>
    </>
}




export default Prioriteringsside;

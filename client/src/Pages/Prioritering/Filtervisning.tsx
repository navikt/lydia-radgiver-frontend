import { Filterverdier } from "../../domenetyper";

const Filtervisning = ({ fylker, kommuner} : Filterverdier ) => {
    return <div>
        {fylker.forEach(fylke => <p>{fylke.navn}</p>)}
        {kommuner.forEach(kommune => <p>{kommune.navn}</p>)}
    </div>
}

export default Filtervisning
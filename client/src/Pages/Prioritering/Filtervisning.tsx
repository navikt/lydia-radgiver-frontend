import { Filterverdier } from "../../domenetyper";

const Filtervisning = ({ fylker, kommuner} : Filterverdier ) => {
    return <div>
        {fylker.map(fylke => <p>{fylke.navn}</p>)}
        {kommuner.map(kommune => <p>{kommune.navn}</p>)}
    </div>
}

export default Filtervisning
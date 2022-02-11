import { Filterverdier } from "../../domenetyper";

const Filtervisning = ({ fylker } : Filterverdier ) => {
    return (
        <div>
            {fylker.map(fylke => {
                return (
                    <div>
                        <h1>{fylke.fylke.navn}</h1>
                        {fylke.kommuner.map(kommune => <p>{kommune.navn}</p>)}
                    </div>
                )
            })}
        </div>
    )
}

export default Filtervisning;
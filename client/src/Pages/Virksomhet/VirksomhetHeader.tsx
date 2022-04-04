import {Virksomhet} from "../../domenetyper";

interface Props {
    virksomhet: Virksomhet
}

export const VirksomhetHeader = ({ virksomhet: { orgnr, navn, neringsgrupper, adresse, postnummer, poststed }}: Props) => (
    <div>
        <h1>{navn}</h1>
        <hr />
        <div>
            <h4>Orgnummer</h4>
            <p>{orgnr}</p>
        </div>

        <div>
            <h4>Bransje/næring</h4>
            {neringsgrupper.map(({ navn}) => (<p key={navn}>{navn}</p>))}
        </div>
        <div>
            <h4>Adresse</h4>
            {adresse.map(x => (<p key={`adresse-${x}`}>{x}</p>))}
            <p>{postnummer} {poststed}</p>
        </div>
    </div>
)


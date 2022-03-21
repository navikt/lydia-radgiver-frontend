import {Næringsgruppe} from "../../domenetyper";

export interface Virksomhet {
    orgnr: string,
    navn: string,
    adresse: string[],
    neringsgrupper: Næringsgruppe[]
}

interface Props {
    virksomhet: Virksomhet
}

export const VirksomhetHeader = ({ virksomhet: { orgnr, navn, neringsgrupper, adresse }}: Props) => (
    <div>
        <h1>{navn}</h1>
        <hr />
        <div>
            <h4>Orgnummer</h4>
            <p>{orgnr}</p>
        </div>

        <div>
            <h4>Bransje/næring</h4>
            <p>{neringsgrupper.map(({ navn}) => navn).join("\n")}</p>
        </div>
        <div>
            <h4>Adresse</h4>
            <p>{adresse.join("\n")}</p>
        </div>
        <a href="#">Se hele organisasjonsstrukturen</a>
    </div>
)


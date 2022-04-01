import {Virksomhet} from "../../domenetyper";

interface Props {
    virksomhet: Virksomhet
}

export const VirksomhetHeader = ({ virksomhet: { organisasjonsnummer, navn, neringsgrupper, beliggenhetsadresse }}: Props) => (
    <div>
        <h1>{navn}</h1>
        <hr />
        <div>
            <h4>Orgnummer</h4>
            <p>{organisasjonsnummer}</p>
        </div>

        <div>
            <h4>Bransje/næring</h4>
            <p>{neringsgrupper.map(({ navn}) => navn).join("\n")}</p>
        </div>
        <div>
            <h4>Adresse</h4>
            <p>{beliggenhetsadresse.join("\n")}</p>
        </div>
        <a href="#">Se hele organisasjonsstrukturen</a>
    </div>
)


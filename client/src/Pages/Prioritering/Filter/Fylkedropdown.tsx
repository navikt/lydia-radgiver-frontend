import { CSSProperties } from "react";
import { Select } from "@navikt/ds-react";
import { sorterAlfabetisk } from "../../../util/sortering";
import { Fylke, FylkeMedKommuner } from "../../../domenetyper/fylkeOgKommune";

interface Props {
    fylkerOgKommuner: FylkeMedKommuner[];
    valgtFylke: Fylke | undefined;
    endreFylke: (fylkesnummer: string) => void;
    style?: CSSProperties;
}

export const Fylkedropdown = ({ fylkerOgKommuner, valgtFylke, endreFylke, style }: Props) => {
    return (
        <Select
            label="Fylke"
            value={valgtFylke?.nummer ?? ""}
            onChange={(e) => endreFylke(e.target.value)}
            style={style}
        >
            <option value="">Alle</option>
            {fylkerOgKommuner
                .sort((a, b) => sorterAlfabetisk(a.fylke.navn, b.fylke.navn))
                .map(({ fylke }) => (
                    <option value={fylke.nummer} key={fylke.nummer}>
                        {fylke.navn}
                    </option>
                ))}
        </Select>
    );
};

export const kommunenummerTilKommune = (kommunenummer: string, fylkerMedKommuner: FylkeMedKommuner[]) => {
    return fylkerMedKommuner
        .find(({ fylke }) => fylke.nummer === kommunenummer.substring(0, 2))
        ?.kommuner.find(({ nummer }) => nummer === kommunenummer);
};

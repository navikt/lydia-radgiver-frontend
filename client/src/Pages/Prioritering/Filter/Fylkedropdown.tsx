import {Fylke, FylkeMedKommuner} from "../../../domenetyper";
import {Select} from "@navikt/ds-react";
import {CSSProperties} from "react";
import {sorterAlfabetisk} from "../../../util/sortering";

export const Fylkedropdown = ({fylkerOgKommuner, valgtFylke, endreFylke, style}: {
    fylkerOgKommuner: FylkeMedKommuner[];
    valgtFylke: Fylke | undefined;
    endreFylke: (fylkesnummer: string) => void;
    style?: CSSProperties;
}) => {
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
                .map(({fylke}) => (
                    <option value={fylke.nummer} key={fylke.nummer}>
                        {fylke.navn}
                    </option>
                ))}
        </Select>
    );
};

export const kommunenummerTilKommune = (
    kommunenummer: string,
    fylkerMedKommuner: FylkeMedKommuner[]
) =>
    fylkerMedKommuner
        .find(({fylke}) => fylke.nummer === kommunenummer.substring(0, 2))
        ?.kommuner.find(({nummer}) => nummer === kommunenummer);

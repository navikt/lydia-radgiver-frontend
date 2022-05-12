import {Fylke, FylkerMedKommuner} from "../../domenetyper";
import {Select} from "@navikt/ds-react";
import {stateUpdater} from "./Filtervisning";
import {CSSProperties} from "react";
import {sorterAlfabetisk} from "../../util/sortering";

export const Fylkedropdown = ({fylkerOgKommuner, valgtFylke, endreFylke, style}: {
    fylkerOgKommuner: FylkerMedKommuner[];
    valgtFylke: Fylke | undefined;
    endreFylke: stateUpdater;
    style?: CSSProperties;
}) => {
    return (
        <Select
            label="Fylke"
            value={valgtFylke?.nummer ?? ""}
            onChange={(e) => endreFylke(e.target.value)}
            style={style}
        >
            <option value="">Vis alle</option>
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
export const fylkesnummerTilFylke = (
    fylkenummer: string,
    fylkerMedKommuner: FylkerMedKommuner[]
) => {
    return fylkerMedKommuner.find(({fylke}) => fylke.nummer === fylkenummer)
        ?.fylke;
};
export const kommunenummerTilKommune = (
    kommunenummer: string,
    fylkerMedKommuner: FylkerMedKommuner[]
) =>
    fylkerMedKommuner
        .find(({fylke}) => fylke.nummer === kommunenummer.substring(0, 2))
        ?.kommuner.find(({nummer}) => nummer === kommunenummer);

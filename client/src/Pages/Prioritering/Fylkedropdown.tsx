import {Fylke, FylkerMedKommuner} from "../../domenetyper";
import {Select} from "@navikt/ds-react";
import {sorterAlfabetisk, stateUpdater} from "./Filtervisning";

export const Fylkedropdown = ({fylkerOgKommuner, valgtFylke, endreFylke}: {
    fylkerOgKommuner: FylkerMedKommuner[];
    valgtFylke: Fylke | undefined;
    endreFylke: stateUpdater;
}) => {
    return (
        <Select
            label="Fylke"
            value={valgtFylke?.nummer ?? ""}
            onChange={(e) => endreFylke(e.target.value)}
        >
            <option value="">Velg fylke</option>
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
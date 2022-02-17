import { Filterverdier, Fylke, FylkerMedKommuner, Kommune } from "../../domenetyper";
import { Select } from "@navikt/ds-react";
import { useState } from "react";
import { Søkeverdier } from "../../api/lydia-api";

type stateUpdater = (value: string) => void;

const Fylkedropdown = ({
    fylkerOgKommuner,
    valgtFylke,
    endreFylke,
}: {
    fylkerOgKommuner: FylkerMedKommuner[];
    valgtFylke?: Fylke;
    endreFylke: stateUpdater;
}) => {
    return (
        <Select
            label="Fylke"
            value={valgtFylke?.nummer ?? ""}
            onChange={(e) => endreFylke(e.target.value)}
        >
            <option value="">Velg fylke</option>
            {fylkerOgKommuner.map(({ fylke }) => (
                <option value={fylke.nummer} key={fylke.nummer}>
                    {fylke.navn}
                </option>
            ))}
        </Select>
    );
};

const Kommunedropdown = ({
    kommuner,
    valgtKommune,
    endreKommune,
    valgtFylke,
}: {
    kommuner: Kommune[];
    valgtKommune?: Kommune;
    endreKommune: stateUpdater;
    valgtFylke?: Fylke;
}) => {
    const filtrerteKommuner = valgtFylke
        ? kommuner.filter((ko) => ko.nummer.startsWith(valgtFylke.nummer))
        : kommuner;

    return (
        <Select
            label="Kommune"
            value={valgtKommune?.nummer ?? ""}
            onChange={(e) => {
                endreKommune(e.target.value);
            }}
        >
            <option value={""} key={"emptykommune"}>
                Velg kommune
            </option>
            {filtrerteKommuner.map((kommune) => (
                <option value={kommune.nummer} key={kommune.nummer}>
                    {kommune.navn}
                </option>
            ))}
        </Select>
    );
};

interface FiltervisningProps {
    filterverdier: Filterverdier;
    oppdaterSøkeverdier: (søkeverdier: Søkeverdier) => void;
}

const fylkesnummerTilFylke = (fylkenummer: string, fylkerMedKommuner : FylkerMedKommuner[]) => {
    return fylkerMedKommuner.find(({ fylke }) => fylke.nummer === fylkenummer)?.fylke;
}
const kommunenummerTilKommune = (kommunenummer: string, fylkerMedKommuner : FylkerMedKommuner[]) => 
    fylkerMedKommuner.find(({ fylke }) => fylke.nummer === kommunenummer.substring(0, 2))
        ?.kommuner.find(({ nummer }) => nummer === kommunenummer);

const Filtervisning = ({ filterverdier, oppdaterSøkeverdier }: FiltervisningProps) => {
    const [valgtFylke, setValgtFylke] = useState<Fylke>();
    const [valgtKommune, setValgtKommune] = useState<Kommune>();
    const endreFylke = (fylkenummer: string) => {
        const endretFylke = fylkesnummerTilFylke(fylkenummer, filterverdier.fylker)
        if (!endretFylke)
            return
        setValgtFylke(endretFylke);
        if (!valgtKommune?.nummer.startsWith(endretFylke.nummer))
            setValgtKommune(undefined);
        oppdaterSøkeverdier({
            fylker: [endretFylke],
        });
    };
    const endreKommune = (kommunenummer: string) => {
        const endretKommune = kommunenummerTilKommune(kommunenummer, filterverdier.fylker)
        if (!endretKommune)
            return
        setValgtKommune(endretKommune);
        oppdaterSøkeverdier({
            kommuner: [endretKommune],
        });
    };
    return (
        <div>
            <Fylkedropdown
                fylkerOgKommuner={filterverdier.fylker}
                valgtFylke={valgtFylke}
                endreFylke={endreFylke}
            />
            <Kommunedropdown
                kommuner={filterverdier.fylker.flatMap(({ kommuner }) => kommuner)}
                valgtKommune={valgtKommune}
                endreKommune={endreKommune}
                valgtFylke={valgtFylke}
            />
        </div>
    );
};

export default Filtervisning;

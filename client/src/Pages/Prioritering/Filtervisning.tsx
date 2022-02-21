import { Søkeverdier, Filterverdier, Fylke, FylkerMedKommuner, Kommune, Næringsgruppe } from "../../domenetyper";
import { Select } from "@navikt/ds-react";
import { useState } from "react";

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
}: {
    kommuner: Kommune[];
    valgtKommune?: Kommune;
    endreKommune: stateUpdater;
}) => (
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
            {kommuner.map((kommune) => (
                <option value={kommune.nummer} key={kommune.nummer}>
                    {kommune.navn}
                </option>
            ))}
        </Select>
    );

const Næringsgruppedropdown = ({ næringsgrupper, valgtNæringsgruppe, endreNæringsgruppe} : { næringsgrupper : Næringsgruppe[], valgtNæringsgruppe? : Næringsgruppe, endreNæringsgruppe : stateUpdater }) => (
    <Select
        label="Næringsgruppe"
        value={valgtNæringsgruppe?.kode ?? ""}
        onChange={(e) => endreNæringsgruppe(e.target.value)}
    >
        <option value={""} key={"emptynæringsgruppe"}>
            Velg næringsgruppe
        </option>
        {næringsgrupper.map((næringsgruppe) => (
            <option value={næringsgruppe.kode} key={næringsgruppe.kode}>
                {næringsgruppe.navn}
            </option>
        ))}
    </Select>
);

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

const næringsgruppeKodeTilNæringsgruppe = (næringsgruppeKode: string, næringsgrupper : Næringsgruppe[]) => 
    næringsgrupper.find(({ kode }) => kode === næringsgruppeKode);

const filtrerKommunerPåValgtFylke = (fylke: Fylke, kommuner: Kommune[]) => 
    fylke
        ? kommuner.filter((kommune) => kommune.nummer.startsWith(fylke.nummer))
        : kommuner;

const Filtervisning = ({ filterverdier, oppdaterSøkeverdier }: FiltervisningProps) => {
    const [valgtFylke, setValgtFylke] = useState<Fylke>();
    const [valgtKommune, setValgtKommune] = useState<Kommune>();
    const [valgtNæringsgruppe, setValgtNæringsgruppe] = useState<Næringsgruppe>();
    const endreFylke = (fylkenummer: string) => {
        if (fylkenummer === valgtFylke?.nummer) 
            return
        const endretFylke = fylkesnummerTilFylke(fylkenummer, filterverdier.fylker)
        if (!endretFylke)
            return
        setValgtFylke(endretFylke);
        if (!valgtKommune?.nummer.startsWith(endretFylke.nummer))
            setValgtKommune(undefined);
        oppdaterSøkeverdier({
            fylker: [endretFylke],
            kommuner: [],
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
    const endreNæringsgruppe = (næringsgruppeNavn: string) => {
        const endretNæringsgruppe = næringsgruppeKodeTilNæringsgruppe(næringsgruppeNavn, filterverdier.næringsgrupper)
        if (!endretNæringsgruppe)
            return
        setValgtNæringsgruppe(endretNæringsgruppe);
        oppdaterSøkeverdier({
            næringsgrupper: [endretNæringsgruppe],
        });
    };
    const alleKommuner = filterverdier.fylker.flatMap(({ kommuner }) => kommuner)
    const relevanteKommuner = valgtFylke? filtrerKommunerPåValgtFylke(valgtFylke, alleKommuner) : alleKommuner;
    return (
        <div>
            <Næringsgruppedropdown 
                næringsgrupper={filterverdier.næringsgrupper} 
                valgtNæringsgruppe={valgtNæringsgruppe}
                endreNæringsgruppe={endreNæringsgruppe}
            />
            <Fylkedropdown
                fylkerOgKommuner={filterverdier.fylker}
                valgtFylke={valgtFylke}
                endreFylke={endreFylke}
            />
            <Kommunedropdown
                kommuner={relevanteKommuner}
                valgtKommune={valgtKommune}
                endreKommune={endreKommune}
            />
        </div>
    );
};

export default Filtervisning;

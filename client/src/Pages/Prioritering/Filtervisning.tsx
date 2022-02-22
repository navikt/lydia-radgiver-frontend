import {
    Søkeverdier,
    Filterverdier,
    Fylke,
    FylkerMedKommuner,
    Kommune,
    Næringsgruppe,
} from "../../domenetyper";
import { Select } from "@navikt/ds-react";
import { useState } from "react";
import ReactSelect from "react-select";

type stateUpdater = (value: string) => void;
type listStateUpdater = (value: string[]) => void;

const sorterAlfabetisk = (a: string, b: string) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());

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
        {kommuner
            .sort((a, b) => sorterAlfabetisk(a.navn, b.navn))
            .map((kommune) => (
                <option value={kommune.nummer} key={kommune.nummer}>
                    {kommune.navn}
                </option>
            ))}
    </Select>
);

function mapnæringsGruppeTilReactSelectOptions(gruppe: Næringsgruppe) {
    return {
        label: gruppe.navn,
        value: gruppe.kode,
    };
}

const Næringsgruppedropdown = ({
    næringsgrupper,
    valgtNæringsgruppe,
    endreNæringsgrupper,
}: {
    næringsgrupper: Næringsgruppe[];
    valgtNæringsgruppe: Næringsgruppe[];
    endreNæringsgrupper: listStateUpdater;
}) => {
    const options = næringsgrupper.map(mapnæringsGruppeTilReactSelectOptions);
    return (
        <ReactSelect
            noOptionsMessage={() => "Ingen næringsgrupper"}
            options={options}
            defaultValue={valgtNæringsgruppe.map(
                mapnæringsGruppeTilReactSelectOptions
            )}
            placeholder={"Velg næringsgruppe"}
            isMulti
            onChange={(verdier) => {
                endreNæringsgrupper(
                    verdier.map(({ value: næringsgruppe }) => næringsgruppe)
                );
            }}
        />
    );
};

interface FiltervisningProps {
    filterverdier: Filterverdier;
    oppdaterSøkeverdier: (søkeverdier: Søkeverdier) => void;
}

const fylkesnummerTilFylke = (
    fylkenummer: string,
    fylkerMedKommuner: FylkerMedKommuner[]
) => {
    return fylkerMedKommuner.find(({ fylke }) => fylke.nummer === fylkenummer)
        ?.fylke;
};
const kommunenummerTilKommune = (
    kommunenummer: string,
    fylkerMedKommuner: FylkerMedKommuner[]
) =>
    fylkerMedKommuner
        .find(({ fylke }) => fylke.nummer === kommunenummer.substring(0, 2))
        ?.kommuner.find(({ nummer }) => nummer === kommunenummer);

const næringsgruppeKoderTilNæringsgrupper = (
    næringsgruppeKoder: string[],
    næringsgrupper: Næringsgruppe[]
) => næringsgrupper.filter(({ kode }) => næringsgruppeKoder.includes(kode));

const filtrerKommunerPåValgtFylke = (fylke: Fylke, kommuner: Kommune[]) =>
    fylke
        ? kommuner.filter((kommune) => kommune.nummer.startsWith(fylke.nummer))
        : kommuner;

const Filtervisning = ({
    filterverdier,
    oppdaterSøkeverdier,
}: FiltervisningProps) => {
    const [valgtFylke, setValgtFylke] = useState<Fylke>();
    const [valgtKommune, setValgtKommune] = useState<Kommune>();
    const [næringsGrupper, setNæringsGrupper] = useState<Næringsgruppe[]>([]);
    const endreFylke = (fylkenummer: string) => {
        if (fylkenummer === valgtFylke?.nummer) return;
        const endretFylke = fylkesnummerTilFylke(
            fylkenummer,
            filterverdier.fylker
        );
        if (!endretFylke) return;
        setValgtFylke(endretFylke);
        if (!valgtKommune?.nummer.startsWith(endretFylke.nummer))
            setValgtKommune(undefined);
        oppdaterSøkeverdier({
            fylker: [endretFylke],
            kommuner: [],
        });
    };
    const endreKommune = (kommunenummer: string) => {
        const endretKommune = kommunenummerTilKommune(
            kommunenummer,
            filterverdier.fylker
        );
        if (!endretKommune) return;
        setValgtKommune(endretKommune);
        oppdaterSøkeverdier({
            kommuner: [endretKommune],
        });
    };
    const endreNæringsgruppe = (næringsgruppeKoder: string[]) => {
        const endretNæringsgrupper = næringsgruppeKoderTilNæringsgrupper(
            næringsgruppeKoder,
            filterverdier.næringsgrupper
        );
        setNæringsGrupper(endretNæringsgrupper);
        oppdaterSøkeverdier({
            næringsgrupper: endretNæringsgrupper,
        });
    };
    const alleKommuner = filterverdier.fylker.flatMap(
        ({ kommuner }) => kommuner
    );
    const relevanteKommuner = valgtFylke
        ? filtrerKommunerPåValgtFylke(valgtFylke, alleKommuner)
        : alleKommuner;
    return (
        <div>
            <Næringsgruppedropdown
                næringsgrupper={filterverdier.næringsgrupper}
                valgtNæringsgruppe={næringsGrupper}
                endreNæringsgrupper={endreNæringsgruppe}
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

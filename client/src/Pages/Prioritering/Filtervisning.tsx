import { Filterverdier, FylkerMedKommuner, Kommune } from "../../domenetyper";
import { Select } from "@navikt/ds-react";
import { useState } from "react";

type stateUpdater = (value: string) => void;

const Fylkedropdown = ({
    fylkerOgKommuner,
    valgtFylke,
    endreFylke,
}: {
    fylkerOgKommuner: FylkerMedKommuner[];
    valgtFylke: string;
    endreFylke: stateUpdater;
}) => {
    return (
        <Select
            label="Fylke"
            value={valgtFylke}
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
    valgtKommune: string;
    endreKommune: stateUpdater;
    valgtFylke?: string;
}) => {
    const filtrerteKommuner = valgtFylke
        ? kommuner.filter((ko) => ko.nummer.startsWith(valgtFylke))
        : kommuner;

    return (
        <Select
            label="Kommune"
            value={valgtKommune}
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

const Filtervisning = ({ fylker }: Filterverdier) => {
    const [valgtFylke, setValgtFylke] = useState("");
    const [valgtKommune, setValgtKommune] = useState("");
    const endreFylke = (fylkenummer: string) => {
        setValgtFylke(fylkenummer);
        if (fylkenummer && !valgtKommune.startsWith(fylkenummer)) {
            // Tømme kommune
            setValgtKommune("");
        }
    };
    return (
        <div>
            <Fylkedropdown
                fylkerOgKommuner={fylker}
                valgtFylke={valgtFylke}
                endreFylke={endreFylke}
            />
            <Kommunedropdown
                kommuner={fylker.flatMap(({ kommuner }) => kommuner)}
                valgtKommune={valgtKommune}
                endreKommune={setValgtKommune}
                valgtFylke={valgtFylke}
            />
        </div>
    );
};

export default Filtervisning;

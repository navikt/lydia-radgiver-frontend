import {Kommune} from "../../domenetyper";
import {Select} from "@navikt/ds-react";
import {sorterAlfabetisk, stateUpdater} from "./Filtervisning";

export const Kommunedropdown = ({kommuner, valgtKommune, endreKommune}: {
    kommuner: Kommune[];
    valgtKommune: Kommune | undefined;
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
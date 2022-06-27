import {Select} from "@navikt/ds-react";
import {sorteringsverdier} from "./Filtervisning";
import {Sorteringsverdi} from "../../domenetyper";

export const Sorteringsmuligheter = ({valgtSortering, sorteringsMuligheter, endreSortering}: {
    valgtSortering: string;
    sorteringsMuligheter: string[];
    endreSortering: (sortering: Sorteringsverdi) => void;
}) => {
    return (
        <Select
            label="Sortering"
            value={valgtSortering}
            onChange={(e) =>
                endreSortering(e.target.value as Sorteringsverdi)
            }
        >
            {sorteringsMuligheter
                .filter(
                    (sorteringsMulighet) =>
                        sorteringsMulighet in sorteringsverdier
                )
                .map((sortering) => (
                    <option key={sortering} value={sortering}>
                        {
                            sorteringsverdier[
                                sortering as Sorteringsverdi
                            ]
                        }
                    </option>
                ))}
        </Select>
    );
};

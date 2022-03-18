import {Select} from "@navikt/ds-react";
import {sorteringsverdier} from "./Filtervisning";

export const Sorteringsmuligheter = ({valgtSortering, sorteringsMuligheter, endreSortering}: {
    valgtSortering: string;
    sorteringsMuligheter: string[];
    endreSortering: (sortering: keyof typeof sorteringsverdier) => void;
}) => {
    return (
        <Select
            label="Sortering"
            value={valgtSortering}
            onChange={(e) =>
                endreSortering(e.target.value as keyof typeof sorteringsverdier)
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
                                sortering as keyof typeof sorteringsverdier
                                ]
                        }
                    </option>
                ))}
        </Select>
    );
};
import React from "react";
import { useVirksomhetContext } from "../../Pages/Virksomhet/VirksomhetContext";
import { lokalDato } from "../../util/dato";

const FILNAVN_DEL_MAKS = 25;

export default function useEksportFilnavn(
    type: string,
    dato?: Date | null,
    avdeling?: string,
) {
    const { virksomhet } = useVirksomhetContext();
    const { navn: virksomhetsnavn } = virksomhet;

    return React.useMemo(() => {
        let filnavn = type;

        if (virksomhetsnavn) {
            if (virksomhetsnavn.length > FILNAVN_DEL_MAKS) {
                filnavn += `_${virksomhetsnavn.substring(0, FILNAVN_DEL_MAKS)}`;
            } else {
                filnavn += `_${virksomhetsnavn}`;
            }
        }

        if (avdeling) {
            if (avdeling.length > FILNAVN_DEL_MAKS) {
                filnavn += `_${avdeling.substring(0, FILNAVN_DEL_MAKS)}`;
            } else {
                filnavn += `_${avdeling}`;
            }
        }

        if (dato) {
            filnavn += `_${lokalDato(dato)}`;
        } else {
            filnavn += `_${lokalDato(new Date())}`;
        }

        filnavn += ".pdf";

        return filnavn;
    }, []);
}

import React, { useCallback } from "react";
import { erIDev } from "../components/Dekoratør/Dekoratør";

export const statiskeSidetitler = {
    prioriteringsside: lagSidetittel("søk"),
    virksomhetsside: lagSidetittel("virksomhet"),
    statusoversiktside: lagSidetittel("statusoversikt"),
};

function lagSidetittel(tittel: string) {
    return `Fia - ${erIDev ? "DEV - " : ""}${tittel}`;
}

export const useTittel = (
    defaultTittel: string = statiskeSidetitler.prioriteringsside,
) => {
    const [tittel, setTittel] = React.useState<string>(defaultTittel);
    document.title = tittel;
    const oppdaterTittel = useCallback(
        (nyTittel: string) => setTittel(nyTittel),
        [],
    );
    return {
        oppdaterTittel,
    };
};

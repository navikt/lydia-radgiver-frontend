import React, {useCallback} from "react";

export const statiskeSidetitler = {
    prioriteringsside: "Fia - søk",
    virksomhetsside: "Fia - virksomhet",
    lederstatistikkside: "Fia - lederstatistikk",
}

export const useTittel = (defaultTittel: string = statiskeSidetitler.prioriteringsside) => {
    const [tittel, setTittel] = React.useState<string>(defaultTittel);
    document.title = tittel
    const oppdaterTittel = useCallback((nyTittel: string) => setTittel(nyTittel), [])
    return {
        oppdaterTittel
    }
};

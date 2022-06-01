import React from "react";

export const statiskeSidetitler = {
    prioriteringsside: "Fia - søk",
    virksomhetsside: "Fia - virksomhet",
}

interface TittelContextType {
    tittel: string;
    oppdaterTittel: (nyTittel: string) => void
}

export const TittelContext = React.createContext<TittelContextType>({
    tittel: statiskeSidetitler.prioriteringsside,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    oppdaterTittel: () => {}
});


export const TittelProvider = ({children}: { children: React.ReactNode }) => {
    const [tittel, setTittel] = React.useState<string>(statiskeSidetitler.prioriteringsside);
    const oppdaterTittel = (nyTittel: string) => setTittel(nyTittel)
    return <TittelContext.Provider value={{tittel, oppdaterTittel}}>{children}</TittelContext.Provider>;
};

import React from "react";
import { Spørreundersøkelse } from "../../domenetyper/spørreundersøkelse";
import { IASak } from "../../domenetyper/domenetyper";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";

export interface SpørreundersøkelseProviderProps {
    spørreundersøkelseliste: Spørreundersøkelse[];
    iaSak: IASak;
    samarbeid: IaSakProsess;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    kanEndreSpørreundersøkelser: boolean;
    sisteOpprettedeSpørreundersøkelseId: string;
    setSisteOpprettedeSpørreundersøkelseId: (id: string) => void;
    spørreundersøkelseType: SpørreundersøkelseType;

    lasterSpørreundersøkelser?: boolean;
    validererSpørreundersøkelser?: boolean;
    hentSpørreundersøkelserPåNytt?: () => void;
}
export interface CardHeaderProps {
    spørreundersøkelse: Spørreundersøkelse;
    dato?: string;
    erLesebruker?: boolean;
}

export interface CardInnholdProps {
    spørreundersøkelse: Spørreundersøkelse;
}

const SpørreundersøkelseContext = React.createContext<
    SpørreundersøkelseProviderProps | undefined
>(undefined);

export function SpørreundersøkelseProvider({
    children,
    ...remainingProps
}: { children: React.ReactNode } & SpørreundersøkelseProviderProps) {
    return (
        <SpørreundersøkelseContext.Provider
            value={{
                ...remainingProps,
            }}
        >
            {children}
        </SpørreundersøkelseContext.Provider>
    );
}

export function useSpørreundersøkelse() {
    const context = React.useContext(SpørreundersøkelseContext);
    if (context === undefined) {
        throw new Error(
            "useSpørreundersøkelse must be used within a SpørreundersøkelseProvider",
        );
    }
    return context;
}

export function useSpørreundersøkelseliste() {
    const context = useSpørreundersøkelse();
    return context.spørreundersøkelseliste;
}

export function useIaSak() {
    const context = useSpørreundersøkelse();
    return context.iaSak;
}

export function useSamarbeid() {
    const context = useSpørreundersøkelse();
    return context.samarbeid;
}

export function useBrukerRolle() {
    const context = useSpørreundersøkelse();
    return context.brukerRolle;
}

export function useBrukerErEierAvSak() {
    const context = useSpørreundersøkelse();
    return context.kanEndreSpørreundersøkelser;
}

export function useSisteOpprettedeSpørreundersøkelseId() {
    const context = useSpørreundersøkelse();
    return context.sisteOpprettedeSpørreundersøkelseId;
}

export function useSpørreundersøkelseType() {
    const context = useSpørreundersøkelse();
    return context.spørreundersøkelseType;
}

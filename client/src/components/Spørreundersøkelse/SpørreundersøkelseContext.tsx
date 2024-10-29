import React from "react";
import { Spørreundersøkelse } from "../../domenetyper/spørreundersøkelse";
import { IASak } from "../../domenetyper/domenetyper";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { BehovsvurderingCardHeaderInnhold } from "../../Pages/Virksomhet/Kartlegging/BehovsvurderingCardHeaderInnhold";
import { BehovsvurderingRadInnhold } from "../../Pages/Virksomhet/Kartlegging/BehovsvurderingRadInnhold";
import { EvalueringCardHeaderInnhold } from "../../Pages/Virksomhet/Samarbeid/Evaluering/EvalueringCardHeaderInnhold";
import { EvalueringRadInnhold } from "../../Pages/Virksomhet/Samarbeid/Evaluering/EvalueringRadInnhold";

interface SpørreundersøkelseProviderProps {
    spørreundersøkelseliste: Spørreundersøkelse[];
    iaSak: IASak;
    samarbeid: IaSakProsess;
    brukerRolle: "Superbruker" | "Saksbehandler" | "Lesetilgang" | undefined;
    brukerErEierAvSak: boolean;
    sisteOpprettedeSpørreundersøkelseId: string;
    spørreundersøkelseType: "Behovsvurdering" | "Evaluering";
}
interface SpørreundersøkelseContextState {
    komponenter: {
        CardHeader: React.FC<{
            behovsvurdering: Spørreundersøkelse;
            dato?: string;
        }>;
        CardInnhold: React.FC<{ behovsvurdering: Spørreundersøkelse }>;
    };
}

function getComponents(
    spørreundersøkelseType: "Behovsvurdering" | "Evaluering",
) {
    switch (spørreundersøkelseType) {
        case "Behovsvurdering":
            return {
                CardHeader: BehovsvurderingCardHeaderInnhold,
                CardInnhold: BehovsvurderingRadInnhold,
            };
        case "Evaluering":
            return {
                CardHeader: EvalueringCardHeaderInnhold,
                CardInnhold: EvalueringRadInnhold,
            };
    }
}

const SpørreundersøkelseContext = React.createContext<
    | (SpørreundersøkelseProviderProps & SpørreundersøkelseContextState)
    | undefined
>(undefined);

export function SpørreundersøkelseProvider({
    children,
    ...remainingProps
}: { children: React.ReactNode } & SpørreundersøkelseProviderProps) {
    return (
        <SpørreundersøkelseContext.Provider
            value={{
                ...remainingProps,
                komponenter: getComponents(
                    remainingProps.spørreundersøkelseType,
                ),
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
    return context.brukerErEierAvSak;
}

export function useSisteOpprettedeSpørreundersøkelseId() {
    const context = useSpørreundersøkelse();
    return context.sisteOpprettedeSpørreundersøkelseId;
}

export function useSpørreundersøkelseType() {
    const context = useSpørreundersøkelse();
    return context.spørreundersøkelseType;
}

export function useSpørreundersøkelseKomponenter() {
    const context = useSpørreundersøkelse();
    return context.komponenter;
}

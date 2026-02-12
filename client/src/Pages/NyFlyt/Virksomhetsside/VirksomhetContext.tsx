import React from "react";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { IASak } from "../../../domenetyper/domenetyper";

export type VirksomhetContextType = {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    lasterIaSak: boolean;
    fane: string;
    setFane: (fane: string) => void;
    spørreundersøkelseId: string | null;
};

const VirksomhetContext = React.createContext<VirksomhetContextType | null>(
    null,
);

export function useVirksomhetContext(): VirksomhetContextType {
    const context = React.useContext(VirksomhetContext);

    if (!context) {
        //TODO: Trenger vi noe error boundary her?
        throw new Error(
            "useVirksomhetContext må brukes innenfor en VirksomhetContextProvider",
        );
    }

    return context;
}

export function useErPåAktivSak() {
    try {
        const context = useVirksomhetContext();

        if (!context) {
            return false;
        }

        return (
            context.iaSak?.saksnummer === context.virksomhet.aktivtSaksnummer
        );
    } catch {
        // Hvis vi ikke har context så er vi ikke på aktiv sak
        return false;
    }
}

export function useErPåInaktivSak() {
    const context = useVirksomhetContext();
    if (!context) {
        return false;
    }

    return (
        context.iaSak?.saksnummer &&
        context.iaSak?.saksnummer !== context.virksomhet.aktivtSaksnummer
    );
}

export default VirksomhetContext;

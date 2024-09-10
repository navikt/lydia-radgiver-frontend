import React from "react";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

export type SamarbeidContextType = {
    virksomhet: Virksomhet;
    iaSak: IASak;
    alleSamarbeid: IaSakProsess[];
    gjeldendeSamarbeid: IaSakProsess;
};

const SamarbeidsContext = React.createContext<SamarbeidContextType | null>(
    null,
);

export function useSamarbeidsContext(): SamarbeidContextType {
    const context = React.useContext(SamarbeidsContext);

    if (!context) {
        //TODO: Trenger vi noe error boundary her?
        throw new Error(
            "useVirksomhetContext må brukes innenfor en VirksomhetContextProvider",
        );
    }

    return context;
}

export default SamarbeidsContext;

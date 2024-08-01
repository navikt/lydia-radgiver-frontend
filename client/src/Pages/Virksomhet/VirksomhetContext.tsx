import React from "react";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { IASak } from "../../domenetyper/domenetyper";

export type VirksomhetContextType = {
	virksomhet: Virksomhet;
	iaSak?: IASak;
	lasterIaSak: boolean;
	fane: string;
	setFane: (fane: string) => void;
	kartleggingId: string | null;
	setVisKonfetti: (visKonfetti: boolean) => void;
	visKonfetti: boolean;
};

const VirksomhetContext = React.createContext<VirksomhetContextType | null>(null);

export function useVirksomhetContext() {
	const context = React.useContext(VirksomhetContext);

	if (!context) {
		//TODO: Trenger vi noe error boundary her?
		throw new Error("useVirksomhetContext må brukes innenfor en VirksomhetContextProvider");
	}

	return context;
}

export default VirksomhetContext;
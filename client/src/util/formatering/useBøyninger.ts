import React from "react";
import { muligeHandlinger, MuligSamarbeidsgandling } from "../../domenetyper/samarbeidsEndring";

export type Bøyinger = {
	infinitiv: string;
	presensPerfektum: string;
	imperativ: string;
};

export function useBøyningerAvSamarbeidshandling(handling: MuligSamarbeidsgandling): Bøyinger {
	return React.useMemo(() => {
		switch (handling) {
			case muligeHandlinger.Enum.fullfores:
				return {
					infinitiv: "fullføre",
					imperativ: "fullfør",
					presensPerfektum: "fullført",
				};
			case muligeHandlinger.Enum.avbrytes:
				return {
					infinitiv: "avbryte",
					imperativ: "avbryt",
					presensPerfektum: "avbrutt",
				};
			case muligeHandlinger.Enum.slettes:
				return {
					infinitiv: "slette",
					imperativ: "slett",
					presensPerfektum: "slettet",
				};
		};
	}, [handling]);
}
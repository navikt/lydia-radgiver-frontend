import React from "react";
import {
    muligeHandlinger,
    MuligSamarbeidsgandling,
} from "../../domenetyper/samarbeidsEndring";

export type Bøyinger = {
    infinitiv: string | null;
    presensPerfektum: string | null;
    imperativ: string | null;
};

export function useBøyningerAvSamarbeidshandling(
    handling: MuligSamarbeidsgandling,
): Bøyinger {
    return React.useMemo(() => {
        switch (handling) {
            case muligeHandlinger.enum.fullfores:
                return {
                    infinitiv: "fullføre",
                    imperativ: "fullfør",
                    presensPerfektum: "fullført",
                };
            case muligeHandlinger.enum.avbrytes:
                return {
                    infinitiv: "avbryte",
                    imperativ: "avbryt",
                    presensPerfektum: "avbrutt",
                };
            case muligeHandlinger.enum.slettes:
                return {
                    infinitiv: "slette",
                    imperativ: "slett",
                    presensPerfektum: "slettet",
                };
        }
    }, [handling]);
}

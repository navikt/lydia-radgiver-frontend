import React, { useState } from "react";
import { Spørreundersøkelse } from "../domenetyper/spørreundersøkelse";

export function usePollingAvKartleggingVedAvsluttetStatus(
    spørreundersøkelseStatus: string,
    spørreundersøkelse: Spørreundersøkelse,
    hentKartleggingPåNytt: () => void,
) {
    const [forsøkPåÅHenteKartlegging, setForsøkPåÅHenteKartlegging] =
        useState(0);

    React.useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (
            spørreundersøkelseStatus === "AVSLUTTET" &&
            spørreundersøkelse.publiseringStatus === "OPPRETTET" &&
            forsøkPåÅHenteKartlegging < 10
        ) {
            const delay = (forsøkPåÅHenteKartlegging + 1) * 2000;
            timeoutId = setTimeout(() => {
                hentKartleggingPåNytt();
                setForsøkPåÅHenteKartlegging((prev) => prev + 1);
            }, delay);
        }

        return () => {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        };
    }, [
        spørreundersøkelseStatus,
        spørreundersøkelse.publiseringStatus,
        hentKartleggingPåNytt,
        forsøkPåÅHenteKartlegging,
    ]);

    // Derive henterKartleggingPånytt from the polling conditions
    const henterKartleggingPånytt =
        spørreundersøkelseStatus === "AVSLUTTET" &&
        spørreundersøkelse.publiseringStatus === "OPPRETTET" &&
        forsøkPåÅHenteKartlegging < 10;

    return { henterKartleggingPånytt, forsøkPåÅHenteKartlegging };
}

import React from "react";
import { Plan } from "../../../../domenetyper/plan";

export function usePollingAvSamarbeidsplan(
    plan: Plan,
    hentSamarbeidsplanPåNytt: () => void,
) {
    const [forsøkPåÅHenteSamarbeidsplan, setForsøkPåÅHenteSamarbeidsplan] =
        React.useState(0);

    const MAKS_FORSØK = 10;
    const pollerSamarbeidsplan = forsøkPåÅHenteSamarbeidsplan < MAKS_FORSØK;

    React.useEffect(() => {
        if (
            plan?.publiseringStatus !== "OPPRETTET" ||
            forsøkPåÅHenteSamarbeidsplan >= MAKS_FORSØK
        ) {
            return;
        }

        const timeoutId = setTimeout(
            () => {
                hentSamarbeidsplanPåNytt();
                setForsøkPåÅHenteSamarbeidsplan((n) => n + 1);
            },
            (forsøkPåÅHenteSamarbeidsplan + 1) * 2000,
        );

        return () => {
            clearTimeout(timeoutId);
        };
    }, [
        hentSamarbeidsplanPåNytt,
        forsøkPåÅHenteSamarbeidsplan,
        plan?.publiseringStatus,
    ]);

    return { pollerSamarbeidsplan };
}

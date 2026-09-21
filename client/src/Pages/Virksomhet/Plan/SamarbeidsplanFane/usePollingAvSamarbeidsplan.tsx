import React from "react";
import { Plan } from "../../../../domenetyper/plan";

export function usePollingAvSamarbeidsplan(
    plan: Plan,
    hentSamarbeidsplanPåNytt: () => void,
) {
    const [forsøkPåÅHenteSamarbeidsplan, setForsøkPåÅHenteSamarbeidsplan] =
        React.useState(0);

    React.useEffect(() => {
        if (
            plan?.publiseringStatus !== "OPPRETTET" ||
            forsøkPåÅHenteSamarbeidsplan >= 10
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

    return { forsøkPåÅHenteSamarbeidsplan };
}

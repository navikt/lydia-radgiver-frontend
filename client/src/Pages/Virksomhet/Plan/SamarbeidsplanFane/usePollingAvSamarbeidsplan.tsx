import React from "react";
import { Plan } from "../../../../domenetyper/plan";

export function usePollingAvSamarbeidsplan(
	plan: Plan,
	hentSamarbeidsplanPåNytt: () => void) {
	const [henterSamarbeidsplanPånytt, setHenterSamarbeidsplanPåNytt] = React.useState(false);

	const [forsøkPåÅHenteSamarbeidsplan, setForsøkPåÅHenteSamarbeidsplan] = React.useState(0);

	React.useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		if (plan?.publiseringStatus === "OPPRETTET") {
			if (!henterSamarbeidsplanPånytt &&
				forsøkPåÅHenteSamarbeidsplan < 10) {
				setHenterSamarbeidsplanPåNytt(true);
				setForsøkPåÅHenteSamarbeidsplan(
					forsøkPåÅHenteSamarbeidsplan + 1
				);
				timeoutId = setTimeout(
					() => {
						hentSamarbeidsplanPåNytt();
						setHenterSamarbeidsplanPåNytt(false);
					},
					(forsøkPåÅHenteSamarbeidsplan + 1) * 2000
				);
			}
		}

		return () => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		};
	}, [
		hentSamarbeidsplanPåNytt,
		henterSamarbeidsplanPånytt,
		plan?.publiseringStatus
	]);

	return { henterSamarbeidsplanPånytt, forsøkPåÅHenteSamarbeidsplan };
}

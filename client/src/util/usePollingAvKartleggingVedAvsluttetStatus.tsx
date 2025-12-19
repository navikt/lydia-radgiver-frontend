import React, { useState } from "react";
import { Spørreundersøkelse } from "../domenetyper/spørreundersøkelse";

export function usePollingAvKartleggingVedAvsluttetStatus(
	spørreundersøkelseStatus: string,
	spørreundersøkelse: Spørreundersøkelse,
	hentKartleggingPåNytt: () => void) {
	const [henterKartleggingPånytt, setHenterKartleggingPåNytt] = useState(false);

	const [forsøkPåÅHenteKartlegging, setForsøkPåÅHenteKartlegging] = useState(0);

	React.useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		if (spørreundersøkelseStatus === "AVSLUTTET") {
			if (spørreundersøkelse.publiseringStatus === "OPPRETTET") {
				if (!henterKartleggingPånytt &&
					forsøkPåÅHenteKartlegging < 10) {
					setHenterKartleggingPåNytt(true);
					setForsøkPåÅHenteKartlegging(
						forsøkPåÅHenteKartlegging + 1
					);
					timeoutId = setTimeout(
						() => {
							hentKartleggingPåNytt();
							setHenterKartleggingPåNytt(false);
						},
						(forsøkPåÅHenteKartlegging + 1) * 2000
					);
				}
			}
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
		henterKartleggingPånytt,
	]);

	return { henterKartleggingPånytt, forsøkPåÅHenteKartlegging };
}

import { Spørreundersøkelse } from "../../domenetyper/spørreundersøkelse";
import {
    erSammeDato,
    lokalDatoMedKlokkeslett,
    lokalDato,
} from "../../util/dato";
import { sorterPåDatoSynkende } from "../../util/sortering";

export function sorterPåDato(spørreundersøkelser: Spørreundersøkelse[]) {
    return spørreundersøkelser.sort((a, b) =>
        sorterPåDatoSynkende(a.opprettetTidspunkt, b.opprettetTidspunkt),
    );
}

// gjett interresant tid basert på status
const hentDatoForStatus = (spørreundersøkelse: Spørreundersøkelse) => {
    switch (spørreundersøkelse.status) {
        case "OPPRETTET":
            return spørreundersøkelse.opprettetTidspunkt;
        case "PÅBEGYNT":
            return (
                spørreundersøkelse.påbegyntTidspunkt ||
                spørreundersøkelse.endretTidspunkt ||
                spørreundersøkelse.opprettetTidspunkt
            );
        case "AVSLUTTET":
            return (
                spørreundersøkelse.fullførtTidspunkt ||
                spørreundersøkelse.endretTidspunkt ||
                spørreundersøkelse.opprettetTidspunkt
            );
        case "SLETTET":
            return (
                spørreundersøkelse.endretTidspunkt ||
                spørreundersøkelse.opprettetTidspunkt
            );
    }
};

export function formaterDatoForSpørreundersøkelse(
    spørreundersøkelse: Spørreundersøkelse,
    index: number,
    spørreundersøkelser: Spørreundersøkelse[],
) {
    const datoForStatus = hentDatoForStatus(spørreundersøkelse);
    // Vi anntar at spørreundersøkelser er sortert på dato, så vi trenger kun å sjekke de to nærmeste spørreundersøkelsene
    if (
        index > 0 &&
        erSammeDato(
            datoForStatus,
            hentDatoForStatus(spørreundersøkelser[index - 1]),
        )
    ) {
        return lokalDatoMedKlokkeslett(datoForStatus);
    }

    if (
        index < spørreundersøkelser.length - 1 &&
        erSammeDato(
            datoForStatus,
            hentDatoForStatus(spørreundersøkelser[index + 1]),
        )
    ) {
        return lokalDatoMedKlokkeslett(datoForStatus);
    }

    return lokalDato(datoForStatus);
}

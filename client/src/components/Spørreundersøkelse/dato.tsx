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
export function formaterDatoForSpørreundersøkelse(
    spørreundersøkelse: Spørreundersøkelse,
    index: number,
    spørreundersøkelser: Spørreundersøkelse[],
) {
    // Vi anntar at spørreundersøkelser er sortert på dato, så vi trenger kun å sjekke de to nærmeste spørreundersøkelsene
    if (
        index > 0 &&
        erSammeDato(
            spørreundersøkelse.opprettetTidspunkt,
            spørreundersøkelser[index - 1].opprettetTidspunkt,
        )
    ) {
        return lokalDatoMedKlokkeslett(spørreundersøkelse.opprettetTidspunkt);
    }

    if (
        index < spørreundersøkelser.length - 1 &&
        erSammeDato(
            spørreundersøkelse.opprettetTidspunkt,
            spørreundersøkelser[index + 1].opprettetTidspunkt,
        )
    ) {
        return lokalDatoMedKlokkeslett(spørreundersøkelse.opprettetTidspunkt);
    }

    return lokalDato(spørreundersøkelse.opprettetTidspunkt);
}

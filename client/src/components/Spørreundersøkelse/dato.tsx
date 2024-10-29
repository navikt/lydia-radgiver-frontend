import { IASakKartlegging } from "../../domenetyper/iaSakKartlegging";
import {
    erSammeDato,
    lokalDatoMedKlokkeslett,
    lokalDato,
} from "../../util/dato";
import { sorterPåDatoSynkende } from "../../util/sortering";

export function sorterPåDato(spørreundersøkelseliste: IASakKartlegging[]) {
    return spørreundersøkelseliste.sort((a, b) =>
        sorterPåDatoSynkende(a.opprettetTidspunkt, b.opprettetTidspunkt),
    );
}
export function formaterDatoForSpørreundersøkelse(
    spørreundersøkelse: IASakKartlegging,
    index: number,
    spørreundersøkelseliste: IASakKartlegging[],
) {
    // Vi anntar at spørreundersøkelseliste er sortert på dato, så vi trenger kun å sjekke de to nærmeste kartleggingene
    if (
        index > 0 &&
        erSammeDato(
            spørreundersøkelse.opprettetTidspunkt,
            spørreundersøkelseliste[index - 1].opprettetTidspunkt,
        )
    ) {
        return lokalDatoMedKlokkeslett(spørreundersøkelse.opprettetTidspunkt);
    }

    if (
        index < spørreundersøkelseliste.length - 1 &&
        erSammeDato(
            spørreundersøkelse.opprettetTidspunkt,
            spørreundersøkelseliste[index + 1].opprettetTidspunkt,
        )
    ) {
        return lokalDatoMedKlokkeslett(spørreundersøkelse.opprettetTidspunkt);
    }

    return lokalDato(spørreundersøkelse.opprettetTidspunkt);
}

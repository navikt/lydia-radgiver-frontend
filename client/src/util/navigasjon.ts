import { erIDev } from "../components/Dekoratør/Dekoratør";
import { SpørreundersøkelseStatus } from "../domenetyper/domenetyper";

export const åpneSpørreundersøkelseINyFane = (
    spørreundersøkelseId: string,
    status: SpørreundersøkelseStatus,
) => {
    const kartleggingHost = erIDev
        ? `https://fia-arbeidsgiver.ekstern.dev.nav.no`
        : `https://fia-arbeidsgiver.nav.no`;
    const baseUrl = `${kartleggingHost}/${spørreundersøkelseId}/vert`;
    switch (status) {
        case "PÅBEGYNT":
            window.open(`${baseUrl}/oversikt`);
            break;
        default:
            window.open(`${baseUrl}`);
            break;
    }
};

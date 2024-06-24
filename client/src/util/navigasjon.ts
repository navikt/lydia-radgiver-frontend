import { erIDemo, erIDev } from "../components/Dekoratør/Dekoratør";

export const åpneKartleggingINyFane = (
    kartleggingId: string,
    vertId: string,
    kartleggingStatus: string,
) => {
    const kartleggingHost = (erIDev || erIDemo)
        ? `https://fia-arbeidsgiver.ekstern.dev.nav.no`
        : `https://fia-arbeidsgiver.nav.no`;
    const baseUrl = `${kartleggingHost}/${kartleggingId}/vert/${vertId}`;
    switch (kartleggingStatus) {
        case "PÅBEGYNT":
            window.open(`${baseUrl}/oversikt`);
            break;
        default:
            window.open(`${baseUrl}`);
            break;
    }
};

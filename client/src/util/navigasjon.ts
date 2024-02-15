export const åpneKartleggingINyFane = (kartleggingId: string, vertId: string) => {
    window.open(
        `https://fia-arbeidsgiver.ekstern.dev.nav.no/${kartleggingId}/vert/${vertId}`)
}

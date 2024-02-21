export const åpneKartleggingINyFane = (kartleggingId: string, vertId: string) => {
    window.open(
        `${import.meta.env.VITE_KARTLEGGING_URL}/${kartleggingId}/vert/${vertId}`)
}

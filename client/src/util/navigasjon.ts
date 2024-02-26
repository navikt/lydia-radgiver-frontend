export const åpneKartleggingINyFane = (
    kartleggingId: string,
    vertId: string,
    kartleggingStatus: string,
) => {
    const baseUrl = `${import.meta.env.VITE_KARTLEGGING_URL}/${kartleggingId}/vert/${vertId}`;
    switch (kartleggingStatus) {
        case "PÅBEGYNT":
            window.open(`${baseUrl}/oversikt`);
            break;
        default:
            window.open(`${baseUrl}`);
            break;
    }
};

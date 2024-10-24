import {
    IASakKartlegging,
    iaSakKartleggingSchema,
} from "../../domenetyper/iaSakKartlegging";
import {
    IASakKartleggingResultat,
    behovsvurderingResultatSchema,
} from "../../domenetyper/iaSakKartleggingResultat";
import {
    IaSakProsess,
    iaSakProsessSchema,
} from "../../domenetyper/iaSakProsess";
import { iaSakPath, kartleggingPath } from "./paths";
import { httpDelete, post, put, useSwrTemplate } from "./networkRequests";

export const useHentKartleggingResultat = (
    orgnummer: string,
    saksnummer: string,
    kartleggingId: string,
) => {
    return useSwrTemplate<IASakKartleggingResultat>(
        `${kartleggingPath}/${orgnummer}/${saksnummer}/${kartleggingId}`,
        behovsvurderingResultatSchema,
    );
};

export const useHentSamarbeid = (orgnummer?: string, saksnummer?: string) => {
    return useSwrTemplate<IaSakProsess[]>(
        saksnummer && orgnummer
            ? `${iaSakPath}/${orgnummer}/${saksnummer}/prosesser`
            : null,
        iaSakProsessSchema.array(),
    );
};

export const avsluttKartlegging = (
    orgnummer: string,
    saksnummer: string,
    kartleggingId: string,
): Promise<IASakKartlegging> => {
    return post(
        `${kartleggingPath}/${orgnummer}/${saksnummer}/${kartleggingId}/avslutt`,
        iaSakKartleggingSchema,
    );
};

export const slettKartlegging = (
    orgnummer: string,
    saksnummer: string,
    kartleggingId: string,
): Promise<IASakKartlegging> => {
    return httpDelete(
        `${kartleggingPath}/${orgnummer}/${saksnummer}/${kartleggingId}`,
        iaSakKartleggingSchema,
    );
};

export const flyttBehovsvurdering = (
    orgnummer: string,
    saksnummer: string,
    tilProsess: number,
    kartleggingId: string,
): Promise<IASakKartlegging> => {
    return put(`${kartleggingPath}/${kartleggingId}`, iaSakKartleggingSchema, {
        orgnummer,
        saksnummer,
        prosessId: tilProsess,
    });
};
export const useHentBehovsvurderingerMedProsess = (
    orgnummer: string,
    saksnummer: string,
    prosessId: number,
) => {
    return useSwrTemplate<IASakKartlegging[]>(
        `${kartleggingPath}/${orgnummer}/${saksnummer}/prosess/${prosessId}`,
        iaSakKartleggingSchema.array(),
    );
};
export const nyKartleggingPåSak = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
): Promise<IASakKartlegging> => {
    return post(
        `${kartleggingPath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}`,
        iaSakKartleggingSchema,
    );
};

export const startKartlegging = (
    orgnummer: string,
    saksnummer: string,
    kartleggingId: string,
): Promise<IASakKartlegging> => {
    return post(
        `${kartleggingPath}/${orgnummer}/${saksnummer}/${kartleggingId}/start`,
        iaSakKartleggingSchema,
    );
};

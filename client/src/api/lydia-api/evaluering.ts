import {
    IaSakProsess,
    iaSakProsessSchema,
} from "../../domenetyper/iaSakProsess";
import { iaSakPath, evalueringPath } from "./paths";
import { httpDelete, post, put, useSwrTemplate } from "./networkRequests";
import {
    evalueringResultatSchema,
    IASakEvalueringResultat,
} from "../../domenetyper/iaSakEvalueringResultat";
import {
    IASakEvaluering,
    iaSakEvalueringSchema,
} from "../../domenetyper/iaSakEvaluering";

export const useHentEvalueringResultat = (
    orgnummer: string,
    saksnummer: string,
    evalueringId: string,
) => {
    return useSwrTemplate<IASakEvalueringResultat>(
        `${evalueringPath}/${orgnummer}/${saksnummer}/${evalueringId}`,
        evalueringResultatSchema,
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

export const avsluttEvaluering = (
    orgnummer: string,
    saksnummer: string,
    evalueringId: string,
): Promise<IASakEvaluering> => {
    return post(
        `${evalueringPath}/${orgnummer}/${saksnummer}/${evalueringId}/avslutt`,
        iaSakEvalueringSchema,
    );
};

export const slettEvaluering = (
    orgnummer: string,
    saksnummer: string,
    evalueringId: string,
): Promise<IASakEvaluering> => {
    return httpDelete(
        `${evalueringPath}/${orgnummer}/${saksnummer}/${evalueringId}`,
        iaSakEvalueringSchema,
    );
};

export const flyttEvaluering = (
    orgnummer: string,
    saksnummer: string,
    tilProsess: number,
    evalueringId: string,
): Promise<IASakEvaluering> => {
    return put(`${evalueringPath}/${evalueringId}`, iaSakEvalueringSchema, {
        orgnummer,
        saksnummer,
        prosessId: tilProsess,
    });
};
export const useHentEvalueringerMedProsess = (
    orgnummer: string,
    saksnummer: string,
    prosessId: number,
) => {
    return useSwrTemplate<IASakEvaluering[]>(
        `${evalueringPath}/${orgnummer}/${saksnummer}/prosess/${prosessId}`,
        iaSakEvalueringSchema.array(),
    );
};
export const nyEvalueringPåSak = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
): Promise<IASakEvaluering> => {
    return post(
        `${evalueringPath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}`,
        iaSakEvalueringSchema,
    );
};

export const startEvaluering = (
    orgnummer: string,
    saksnummer: string,
    evalueringId: string,
): Promise<IASakEvaluering> => {
    return post(
        `${evalueringPath}/${orgnummer}/${saksnummer}/${evalueringId}/start`,
        iaSakEvalueringSchema,
    );
};

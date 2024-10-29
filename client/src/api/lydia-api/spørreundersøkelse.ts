import {
    Spørreundersøkelse,
    spørreundersøkelseSchema,
} from "../../domenetyper/spørreundersøkelse";
import {
    IASakKartleggingResultat,
    behovsvurderingResultatSchema,
} from "../../domenetyper/iaSakKartleggingResultat";
import {
    IaSakProsess,
    iaSakProsessSchema,
} from "../../domenetyper/iaSakProsess";
import { iaSakPath, spørreundersøkelsePath } from "./paths";
import { httpDelete, post, put, useSwrTemplate } from "./networkRequests";

export const useHentResultat = (
    orgnummer: string,
    saksnummer: string,
    spørreundersøkelseId: string,
) => {
    return useSwrTemplate<IASakKartleggingResultat>(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/${spørreundersøkelseId}`,
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

export const avsluttSpørreundersøkelse = (
    orgnummer: string,
    saksnummer: string,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return post(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/${spørreundersøkelseId}/avslutt`,
        spørreundersøkelseSchema,
    );
};

export const slettSpørreundersøkelse = (
    orgnummer: string,
    saksnummer: string,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return httpDelete(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
    );
};

export const flyttSpørreundersøkelse = (
    orgnummer: string,
    saksnummer: string,
    tilProsess: number,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return put(
        `${spørreundersøkelsePath}/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
        {
            orgnummer,
            saksnummer,
            prosessId: tilProsess,
        },
    );
};
export const useHentSpørreundersøkelser = (
    orgnummer: string,
    saksnummer: string,
    prosessId: number,
    type: "Evaluering" | "Behovsvurdering",
) => {
    return useSwrTemplate<Spørreundersøkelse[]>(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/prosess/${prosessId}/type/${type}`,
        spørreundersøkelseSchema.array(),
    );
};
export const opprettSpørreundersøkelse = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
    type: "Evaluering" | "Behovsvurdering",
): Promise<Spørreundersøkelse> => {
    return post(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}/type/${type}`,
        spørreundersøkelseSchema,
    );
};

export const startSpørreundersøkelse = (
    orgnummer: string,
    saksnummer: string,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return post(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/${spørreundersøkelseId}/start`,
        spørreundersøkelseSchema,
    );
};

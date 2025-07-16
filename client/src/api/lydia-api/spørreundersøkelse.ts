import {
    Spørreundersøkelse,
    spørreundersøkelseSchema,
} from "../../domenetyper/spørreundersøkelse";
import {
    SpørreundersøkelseResultat,
    spørreundersøkelseResultatSchema,
} from "../../domenetyper/spørreundersøkelseResultat";
import {
    IaSakProsess,
    iaSakProsessSchema,
} from "../../domenetyper/iaSakProsess";
import { iaSakPath, spørreundersøkelsePath } from "./paths";
import { httpDelete, post, put, useSwrTemplate } from "./networkRequests";
import {
    SpørreundersøkelseMedInnhold,
    SpørreundersøkelseMedInnholdSchema,
    SpørreundersøkelseType,
} from "../../domenetyper/spørreundersøkelseMedInnhold";
import { spørreundersøkelseHeading } from "../../components/Spørreundersøkelse/SpørreundersøkelseHeading";

export const useHentResultat = (
    orgnummer: string,
    saksnummer: string,
    spørreundersøkelseId: string,
) => {
    return useSwrTemplate<SpørreundersøkelseResultat>(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/${spørreundersøkelseId}`,
        spørreundersøkelseResultatSchema,
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
    type: SpørreundersøkelseType,
) => {
    return useSwrTemplate<Spørreundersøkelse[]>(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/prosess/${prosessId}/type/${spørreundersøkelseHeading(type)}`,
        spørreundersøkelseSchema.array(),
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        },
    );
};
export const useHentSpørreundersøkelseMedInnhold = (
    orgnummer: string,
    saksnummer: string,
    prosessId: number,
    type: SpørreundersøkelseType,
    spørreundersøkelseId: string,
) => {
    return useSwrTemplate<SpørreundersøkelseMedInnhold>(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/prosess/${prosessId}/type/${spørreundersøkelseHeading(type)}/${spørreundersøkelseId}`,
        SpørreundersøkelseMedInnholdSchema,
    );
};

export const opprettSpørreundersøkelse = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
    type: SpørreundersøkelseType,
): Promise<Spørreundersøkelse> => {
    return post(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}/type/${spørreundersøkelseHeading(type)}`,
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

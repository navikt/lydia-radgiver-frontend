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
import { useSwrTemplate } from "./networkRequests";
import {
    SpørreundersøkelseMedInnhold,
    SpørreundersøkelseMedInnholdSchema,
    SpørreundersøkelseType,
} from "../../domenetyper/spørreundersøkelseMedInnhold";
import { spørreundersøkelseHeading } from "../../components/Spørreundersøkelse/SpørreundersøkelseHeading";

export const kartleggingresultatPdfLenke = (
    orgnummer: string,
    saksnummer: string,
    spørreundersøkelseId: string,
) => {
    return `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/${spørreundersøkelseId}/pdf`;
};

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

export const useHentSpørreundersøkelser = (
    orgnummer?: string,
    saksnummer?: string,
    prosessId?: number,
    type?: SpørreundersøkelseType,
) => {
    return useSwrTemplate<Spørreundersøkelse[]>(
        orgnummer && saksnummer && prosessId
            ? `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/prosess/${prosessId}/type/${spørreundersøkelseHeading(type)}`
            : null,
        spørreundersøkelseSchema.array(),
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        },
    );
};

export const useSpørreundersøkelsesliste = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number | string,
) => {
    return useSwrTemplate<Spørreundersøkelse[]>(
        `${spørreundersøkelsePath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}`,
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

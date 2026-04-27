import {
    IASak,
    iaSakSchema,
    ValgtÅrsakNyFlytDto,
    VirksomhetTilstandAutomatiskOppdateringDto,
    VirksomhetTilstandDto,
    virksomhetTilstandAutomatiskOppdateringSchema,
    virksomhetTilstandDtoSchema,
} from "../../domenetyper/domenetyper";
import {
    IaSakProsess,
    iaSakProsessSchema,
    SamarbeidRequest,
} from "../../domenetyper/iaSakProsess";
import {
    Plan,
    PlanInnholdStatus,
    PlanMal,
    PlanSchema,
} from "../../domenetyper/plan";
import {
    TemaRequest,
    UndertemaRequest,
} from "../../Pages/Virksomhet/Plan/Requests";
import {
    Sakshistorikk,
    sakshistorikkSchema,
} from "../../domenetyper/sakshistorikk";
import {
    Spørreundersøkelse,
    spørreundersøkelseSchema,
} from "../../domenetyper/spørreundersøkelse";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import { httpDelete, post, put, useSwrTemplate } from "./networkRequests";
import { nyFlytApiBasePath, nyFlytBasePath } from "./paths";
import { Virksomhet, virksomhetsSchema } from "../../domenetyper/virksomhet";
import { isoDato } from "../../util/dato";

export const useHentTilstandForVirksomhetNyFlyt = (orgnummer?: string) => {
    return useSwrTemplate<VirksomhetTilstandDto>(
        orgnummer ? `${nyFlytBasePath}/${orgnummer}/tilstand` : null,
        virksomhetTilstandDtoSchema,
    );
};

export const useHentVirksomhetNyFlyt = (orgnummer?: string) => {
    return useSwrTemplate<Virksomhet>(
        () => (orgnummer ? `${nyFlytBasePath}/virksomhet/${orgnummer}` : null),
        virksomhetsSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentHistorikkNyFlyt = (orgnummer?: string) => {
    return useSwrTemplate<Sakshistorikk[]>(
        () =>
            orgnummer
                ? `${nyFlytBasePath}/virksomhet/${orgnummer}/historikk`
                : null,
        sakshistorikkSchema.array(),
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentSisteSakNyFlyt = (orgnummer?: string) => {
    return useSwrTemplate<IASak>(
        () =>
            orgnummer
                ? `${nyFlytBasePath}/virksomhet/${orgnummer}/samarbeidsperiode`
                : null,
        iaSakSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentSpesifikkSakNyFlyt = (
    orgnummer?: string,
    saksnummer?: string,
) => {
    return useSwrTemplate<IASak>(
        () =>
            orgnummer && saksnummer
                ? `${nyFlytBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}`
                : null,
        iaSakSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

export const vurderSakNyFlyt = (orgnummer: string): Promise<IASak> => {
    return post(`${nyFlytBasePath}/${orgnummer}/vurder`, iaSakSchema);
};

export const bliEierNyFlyt = (orgnummer: string): Promise<IASak> => {
    return post(`${nyFlytBasePath}/${orgnummer}/bli-eier`, iaSakSchema);
};

export const angreVurderingNyFlyt = (orgnummer: string): Promise<IASak> => {
    return post(`${nyFlytBasePath}/${orgnummer}/angre-vurdering`, iaSakSchema);
};

export const avsluttVurderingNyFlyt = (
    orgnummer: string,
    årsak: ValgtÅrsakNyFlytDto,
): Promise<IASak> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/avslutt-vurdering`,
        iaSakSchema,
        årsak,
    );
};

export const opprettSamarbeidNyFlyt = (
    orgnummer: string,
    nyttSamarbeid: IaSakProsess,
): Promise<IaSakProsess> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/opprett-samarbeid`,
        iaSakProsessSchema,
        nyttSamarbeid,
    );
};

export const opprettKartleggingNyFlyt = (
    orgnummer: string,
    samarbeidId: string | number,
    type: SpørreundersøkelseType,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/opprett-kartlegging/${type}`,
        spørreundersøkelseSchema,
    );
};

export const startKartleggingNyFlyt = (
    orgnummer: string,
    samarbeidId: string | number,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/start-kartlegging/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
    );
};

export const fullførKartleggingNyFlyt = (
    orgnummer: string,
    samarbeidId: string | number,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/fullfor-kartlegging/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
    );
};

export const slettKartleggingNyFlyt = (
    orgnummer: string,
    samarbeidId: string | number,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return httpDelete(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/slett-kartlegging/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
    );
};

export const opprettSamarbeidsplanNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    nyPlan: PlanMal,
): Promise<Plan> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/plan`,
        PlanSchema,
        nyPlan,
    );
};

export const endrePlanNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    planId: string,
    body: TemaRequest[],
): Promise<Plan> => {
    return put(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/plan/${planId}`,
        PlanSchema,
        body,
    );
};

export const endrePlanTemaNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    planId: string,
    temaId: number,
    body: UndertemaRequest[],
): Promise<Plan> => {
    return put(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/plan/${planId}/tema/${temaId}`,
        PlanSchema,
        body,
    );
};

export const endrePlanStatusNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    planId: string,
    temaId: number,
    undertemaId: number,
    body: PlanInnholdStatus,
): Promise<Plan> => {
    return put(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/plan/${planId}/tema/${temaId}/undertema/${undertemaId}/status`,
        PlanSchema,
        body,
    );
};

export const slettSamarbeidsplanNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    planId: string,
): Promise<Plan> => {
    return httpDelete(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/plan/${planId}`,
        PlanSchema,
    );
};

export const slettSamarbeidNyFlyt = (
    orgnummer: string,
    samarbeidId: number,
    dato?: string,
): Promise<IaSakProsess> => {
    const datoParam = dato ? `?dato=${dato}` : "";
    return httpDelete(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/slett-samarbeid${datoParam}`,
        iaSakProsessSchema,
    );
};

export const avsluttSamarbeidNyFlyt = (
    orgnummer: string,
    samarbeidId: number,
    samarbeid: SamarbeidRequest,
    dato?: string,
): Promise<IaSakProsess> => {
    const datoParam = dato ? `?dato=${dato}` : "";
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/avslutt-samarbeid${datoParam}`,
        iaSakProsessSchema,
        samarbeid,
    );
};

export const endreSamarbeidsNavnNyFlyt = (
    orgnummer: string,
    samarbeidId: number,
    samarbeid: { id: number; saksnummer: string; navn: string; status: string },
): Promise<IaSakProsess> => {
    return put(
        `${nyFlytBasePath}/virksomhet/${orgnummer}/samarbeid/${samarbeidId}/oppdater`,
        iaSakProsessSchema,
        samarbeid,
    );
};

export const endrePlanlagtDatoNyFlyt = (
    orgnummer: string,
    body: VirksomhetTilstandAutomatiskOppdateringDto,
): Promise<VirksomhetTilstandAutomatiskOppdateringDto> => {
    return put(
        `${nyFlytBasePath}/virksomhet/${orgnummer}/endre-planlagt-dato`,
        virksomhetTilstandAutomatiskOppdateringSchema,
        {
            ...body,
            planlagtDato: isoDato(body.planlagtDato),
        },
    );
};

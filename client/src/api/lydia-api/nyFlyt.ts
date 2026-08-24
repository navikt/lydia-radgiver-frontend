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
    SamarbeidshistorikkRad,
    samarbeidshistorikkRadSchema,
} from "../../domenetyper/samarbeidshistorikk";
import {
    Spørreundersøkelse,
    spørreundersøkelseSchema,
} from "../../domenetyper/spørreundersøkelse";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import {
    httpDelete,
    patch,
    post,
    put,
    useSwrTemplate,
} from "./networkRequests";
import { nyFlytApiBasePath } from "./paths";
import { Virksomhet, virksomhetsSchema } from "../../domenetyper/virksomhet";
import { isoDato } from "../../util/dato";
import {
    Virksomhetshistorikk,
    virksomhetshistorikkSchema,
} from "../../domenetyper/historikk";

// Virksomhet
export const useHentTilstandForVirksomhetNyFlyt = (orgnummer?: string) => {
    return useSwrTemplate<VirksomhetTilstandDto>(
        orgnummer
            ? `${nyFlytApiBasePath}/virksomhet/${orgnummer}/tilstand`
            : null,
        virksomhetTilstandDtoSchema,
    );
};

export const useHentVirksomhetNyFlyt = (orgnummer?: string) => {
    return useSwrTemplate<Virksomhet>(
        () =>
            orgnummer ? `${nyFlytApiBasePath}/virksomhet/${orgnummer}` : null,
        virksomhetsSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

// rename: vurder sak --> vurder virksomhet
export const vurderSakNyFlyt = (
    orgnummer: string,
    årsak: ValgtÅrsakNyFlytDto,
): Promise<IASak> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/vurder`,
        iaSakSchema,
        årsak,
    );
};

export const angreVurderingNyFlyt = (orgnummer: string): Promise<IASak> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/angre-vurdering`,
        iaSakSchema,
    );
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

export const endrePlanlagtDatoNyFlyt = (
    orgnummer: string,
    body: VirksomhetTilstandAutomatiskOppdateringDto,
): Promise<VirksomhetTilstandAutomatiskOppdateringDto> => {
    return put(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/endre-planlagt-dato`,
        virksomhetTilstandAutomatiskOppdateringSchema,
        {
            ...body,
            planlagtDato: isoDato(body.planlagtDato),
        },
    );
};

export const useHentHistorikkNyFlyt = (orgnummer?: string) => {
    return useSwrTemplate<Sakshistorikk[]>(
        () =>
            orgnummer
                ? `${nyFlytApiBasePath}/virksomhet/${orgnummer}/historikk`
                : null,
        sakshistorikkSchema.array(),
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentHistorikkForVirksomhet = (orgnummer?: string) => {
    return useSwrTemplate<Virksomhetshistorikk>(
        () =>
            orgnummer
                ? `${nyFlytApiBasePath}/virksomhet/${orgnummer}/historikk`
                : null,
        virksomhetshistorikkSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

export const useHentSamarbeidshistorikk = (
    orgnummer?: string,
    saksnummer?: string,
    samarbeidId?: number,
) => {
    return useSwrTemplate<SamarbeidshistorikkRad[]>(
        () =>
            orgnummer && saksnummer && samarbeidId
                ? `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/historikk`
                : null,
        samarbeidshistorikkRadSchema.array(),
    );
};

export const bliEierNyFlyt = (
    orgnummer: string,
    saksnummer: string,
): Promise<IASak> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/bli-eier`,
        iaSakSchema,
    );
};

// Samarbeidsperiode
export const useHentSisteSakNyFlyt = (orgnummer?: string) => {
    return useSwrTemplate<IASak>(
        () =>
            orgnummer
                ? `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode`
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
                ? `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}`
                : null,
        iaSakSchema,
        {
            revalidateOnFocus: true,
        },
    );
};

// Samarbeid
export const opprettSamarbeidNyFlyt = (
    orgnummer: string,
    nyttSamarbeid: IaSakProsess,
): Promise<IaSakProsess> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${nyttSamarbeid.saksnummer}/samarbeid`,
        iaSakProsessSchema,
        nyttSamarbeid,
    );
};

export const slettSamarbeidNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    dato?: string,
): Promise<IaSakProsess> => {
    const datoParam = dato ? `?dato=${dato}` : "";
    return httpDelete(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}${datoParam}`,
        iaSakProsessSchema,
    );
};

export const avsluttSamarbeidNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    samarbeid: SamarbeidRequest,
    dato?: string,
): Promise<IaSakProsess> => {
    const datoParam = dato ? `?dato=${dato}` : "";
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}${datoParam}`,
        iaSakProsessSchema,
        samarbeid,
    );
};

export const endreSamarbeidsNavnNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    nyttNavn: string,
): Promise<IaSakProsess> => {
    return patch(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}`,
        iaSakProsessSchema,
        { typeEndring: "navn", verdi: nyttNavn },
    );
};

// Kartlegging
export const opprettKartleggingNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: string | number,
    type: SpørreundersøkelseType,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/kartlegging/${type}`,
        spørreundersøkelseSchema,
    );
};

export const startKartleggingNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: string | number,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/kartlegging/${spørreundersøkelseId}/start`,
        spørreundersøkelseSchema,
    );
};

export const fullførKartleggingNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: string | number,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/kartlegging/${spørreundersøkelseId}/fullfor`,
        spørreundersøkelseSchema,
    );
};

export const slettKartleggingNyFlyt = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: string | number,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return httpDelete(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/kartlegging/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
    );
};

// Samarbeidsplan
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

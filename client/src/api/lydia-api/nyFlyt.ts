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
import { Plan, PlanMal, PlanSchema } from "../../domenetyper/plan";
import {
    Spørreundersøkelse,
    spørreundersøkelseSchema,
} from "../../domenetyper/spørreundersøkelse";
import { SpørreundersøkelseType } from "../../domenetyper/spørreundersøkelseMedInnhold";
import { httpDelete, post, put, useSwrTemplate } from "./networkRequests";
import { nyFlytBasePath } from "./paths";
import { Virksomhet, virksomhetsSchema } from "../../domenetyper/virksomhet";

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
        `${nyFlytBasePath}/${orgnummer}/avslutt-vurdering`,
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
    samarbeidId: string,
    type: SpørreundersøkelseType,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/opprett-kartlegging/${type}`,
        spørreundersøkelseSchema,
    );
};

export const startKartleggingNyFlyt = (
    orgnummer: string,
    samarbeidId: string,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/start-kartlegging/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
    );
};

export const fullførKartleggingNyFlyt = (
    orgnummer: string,
    samarbeidId: string,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/fullfor-kartlegging/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
    );
};

export const slettKartleggingNyFlyt = (
    orgnummer: string,
    samarbeidId: string,
    spørreundersøkelseId: string,
): Promise<Spørreundersøkelse> => {
    return httpDelete(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/slett-kartlegging/${spørreundersøkelseId}`,
        spørreundersøkelseSchema,
    );
};

export const opprettSamarbeidsplanNyFlyt = (
    orgnummer: string,
    samarbeidId: string,
    nyPlan: PlanMal,
): Promise<Plan> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/opprett-samarbeidsplan`,
        PlanSchema,
        nyPlan,
    );
};

export const slettSamarbeidsplanNyFlyt = (
    orgnummer: string,
    samarbeidId: string,
): Promise<Plan> => {
    return httpDelete(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/slett-samarbeidsplan`,
        PlanSchema,
    );
};

export const slettSamarbeidNyFlyt = (
    orgnummer: string,
    samarbeidId: string,
): Promise<IaSakProsess> => {
    return httpDelete(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/slett-samarbeid`,
        iaSakProsessSchema,
    );
};

export const avsluttSamarbeidNyFlyt = (
    orgnummer: string,
    samarbeidId: string,
    samarbeid: SamarbeidRequest,
): Promise<IaSakProsess> => {
    return post(
        `${nyFlytBasePath}/${orgnummer}/${samarbeidId}/avslutt-samarbeid`,
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
            planlagtDato: body.planlagtDato.toISOString().split("T")[0],
        },
    );
};

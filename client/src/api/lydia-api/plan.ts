import {
    Plan,
    PlanInnhold,
    PlanInnholdStatus,
    PlanMal,
    PlanMalRequest,
    PlanMalSchema,
    PlanSchema,
    PlanTema,
    PlanTemaSchema,
    PlanUndertemaSchema,
} from "../../domenetyper/plan";
import {
    TemaRequest,
    UndertemaRequest,
} from "../../Pages/Virksomhet/Plan/Requests";
import {
    defaultSwrConfiguration,
    post,
    put,
    useSwrTemplate,
} from "./networkRequests";
import { planPath } from "./paths";

export const nyPlanPåSak = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
    plan: PlanMalRequest,
): Promise<Plan> => {
    return post(
        `${planPath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}/opprett`,
        PlanSchema,
        plan,
    );
};

export const endrePlan = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
    body: TemaRequest[],
): Promise<PlanTema[]> => {
    return put(
        `${planPath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}`,
        PlanTemaSchema.array(),
        body,
    );
};
export const endrePlanTema = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
    temaId: number,
    body: UndertemaRequest[],
): Promise<PlanTema> => {
    return put(
        `${planPath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}/${temaId}`,
        PlanTemaSchema,
        body,
    );
};

export const endrePlanStatus = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
    temaId: number,
    undertemaId: number,
    body: PlanInnholdStatus,
): Promise<PlanInnhold> => {
    return put(
        `${planPath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}/${temaId}/${undertemaId}`,
        PlanUndertemaSchema,
        body,
    );
};

export const useHentPlan = (
    orgnummer: string,
    saksnummer: string,
    samarbeidsId: number,
) => {
    return useSwrTemplate<Plan>(
        `${planPath}/${orgnummer}/${saksnummer}/prosess/${samarbeidsId}`,
        PlanSchema,
        defaultSwrConfiguration,
        false,
    );
};

export const useHentPlanMal = () => {
    return useSwrTemplate<PlanMal>(`${planPath}/mal`, PlanMalSchema);
};
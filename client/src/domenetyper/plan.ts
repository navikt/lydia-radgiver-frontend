import { z } from "zod/v4";
import { datoSchema, DokumentStatusEnum } from "./domenetyper";

const IA_PLAN_STATUSER = ["PLANLAGT", "PÅGÅR", "FULLFØRT", "AVBRUTT"] as const;

const PlanStatusSchema = z.enum(IA_PLAN_STATUSER);

export type PlanInnholdStatus = z.infer<typeof PlanStatusSchema>;

export type OpprettInnholdRequest = {
    rekkefølge: number;
    navn: string;
    inkludert: boolean;
    startDato: string | null;
    sluttDato: string | null;
};

export type OpprettTemaRequest = {
    rekkefølge: number;
    navn: string;
    inkludert: boolean;
    innhold: OpprettInnholdRequest[];
};

export type PlanMalRequest = {
    tema: OpprettTemaRequest[];
};

export type PlanMal = z.infer<typeof PlanMalSchema>;
export type RedigertInnholdMal = z.infer<typeof RedigertInnholdMalSchema>;

export const RedigertInnholdMalSchema = z.object({
    rekkefølge: z.number(),
    navn: z.string(),
    inkludert: z.boolean(),
    startDato: datoSchema.nullable(),
    sluttDato: datoSchema.nullable(),
});

export const RedigertTemaMalSchema = z.object({
    rekkefølge: z.number(),
    navn: z.string(),
    inkludert: z.boolean(),
    innhold: z.array(RedigertInnholdMalSchema),
});

export const PlanMalSchema = z.object({
    tema: z.array(RedigertTemaMalSchema),
});

export const PlanUndertemaSchema = z.object({
    id: z.number(),
    navn: z.string(),
    målsetning: z.string(),
    inkludert: z.boolean(),
    status: PlanStatusSchema.nullable(),
    startDato: datoSchema.nullable(),
    sluttDato: datoSchema.nullable(),
    harAktiviteterISalesforce: z.boolean(),
});
export type PlanInnhold = z.infer<typeof PlanUndertemaSchema>;

export const PlanTemaSchema = z.object({
    id: z.number(),
    navn: z.string(),
    inkludert: z.boolean(),
    undertemaer: z.array(PlanUndertemaSchema),
});

export type PlanTema = z.infer<typeof PlanTemaSchema>;

export const PlanSchema = z.object({
    id: z.string(),
    sistEndret: datoSchema,
    sistPublisert: datoSchema.nullable().optional(),
    temaer: z.array(PlanTemaSchema),
    // TODO: Legg til status
    publiseringStatus: DokumentStatusEnum.nullable().optional(),
    harEndringerSidenSistPublisert: z.boolean().optional(),
});

export type Plan = z.infer<typeof PlanSchema>;

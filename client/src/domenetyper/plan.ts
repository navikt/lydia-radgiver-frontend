import { z } from "zod";
import { datoSchema } from "./domenetyper";

const IA_PLAN_STATUSER = ["PLANLAGT", "PÅGÅR", "FULLFØRT"] as const;

const PlanStatusSchema = z.enum(IA_PLAN_STATUSER);

export type PlanStatus = z.infer<typeof PlanStatusSchema>;

export const PlanUndertemaSchema = z.object({
    id: z.number(),
    navn: z.string(),
    målsetning: z.string(),
    beskrivelse: z.string(),
    planlagt: z.boolean(),
    status: PlanStatusSchema.nullable(),
    startDato: datoSchema.nullable(),
    sluttDato: datoSchema.nullable(),
});
export type PlanUndertema = z.infer<typeof PlanUndertemaSchema>;

const PlanRessursSchema = z.object({
    id: z.number(),
    beskrivelse: z.string(),
    url: z.string().nullable(),
});

export type PlanRessurs = z.infer<typeof PlanRessursSchema>;

export const PlanTemaSchema = z.object({
    id: z.number(),
    navn: z.string(),
    planlagt: z.boolean(),
    undertemaer: z.array(PlanUndertemaSchema),
    ressurser: z.array(PlanRessursSchema),
});

export type PlanTema = z.infer<typeof PlanTemaSchema>;

export const PlanSchema = z.object({
    id: z.string(),
    sistEndret: datoSchema,
    sistPublisert: datoSchema.nullable(),
    temaer: z.array(PlanTemaSchema),
});

export type Plan = z.infer<typeof PlanSchema>;

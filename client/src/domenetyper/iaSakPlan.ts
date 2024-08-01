import {z} from "zod";
import {datoSchema} from "./domenetyper";

const IA_PLAN_STATUSER = [
    "PLANLAGT",
    "PÅGÅR",
    "FULLFØRT",
] as const;

const iaSakPlanStatusEnum = z.enum(IA_PLAN_STATUSER);

export type IASakPlanStatusEnum = z.infer<typeof iaSakPlanStatusEnum>;

const iaSakPlanUndertemaSchema = z.object({
    id: z.number(),
    navn: z.string(),
    målsetning: z.string(),
    beskrivelse: z.string(),
    planlagt: z.boolean(),
    status: iaSakPlanStatusEnum.nullable(),
    startDato: datoSchema.nullable(),
    sluttDato: datoSchema.nullable(),
});

const iaSakPlanRessursSchema = z.object({
    id: z.number(),
    beskrivelse: z.string(),
    url: z.string().nullable(),
});

export type IASakPlanRessurs = z.infer<typeof iaSakPlanRessursSchema>;

const iaSakPlanTemaSchema = z.object({
    id: z.number(),
    navn: z.string(),
    planlagt: z.boolean(),
    undertemaer: z.array(iaSakPlanUndertemaSchema),
    ressurser: z.array(iaSakPlanRessursSchema),
});

export const iaSakPlanSchema = z.object({
    id: z.string(),
    sistEndret: datoSchema,
    publisert: z.boolean(),
    sistPublisert: datoSchema.nullable(),
    temaer: z.array(iaSakPlanTemaSchema),
});

export type IASakPlan = z.infer<typeof iaSakPlanSchema>;


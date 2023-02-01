import { z } from "zod";
import { datoSchema, IAProsessStatusEnum } from "./domenetyper";

export const virksomhetsoversiktSchema = z.object({
    orgnr: z.string(),
    virksomhetsnavn: z.string(),
    sektor: z.string().optional(),  //TODO: fjern senere
    neringsgruppe: z.string().optional(),   //TODO: fjern senere
    arstall: z.number().optional(), //TODO: fjern senere
    kvartal: z.number().optional(), //TODO: fjern senere
    sykefraversprosent: z.number(),
    antallPersoner: z.number(),
    muligeDagsverk: z.number(),
    tapteDagsverk: z.number(),
    status: IAProsessStatusEnum,
    eidAv: z.string().nullable(),
    sistEndret: datoSchema.nullable(),
});

export type Virksomhetsoversikt = z.infer<typeof virksomhetsoversiktSchema>;

const virksomhetsoversiktListeSchema = z.array(
    virksomhetsoversiktSchema
);

export const virksomhetsoversiktListeResponsSchema = z.object({
    data: virksomhetsoversiktListeSchema,
});

export type VirksomhetsoversiktListeRespons = z.infer<
    typeof virksomhetsoversiktListeResponsSchema
>;

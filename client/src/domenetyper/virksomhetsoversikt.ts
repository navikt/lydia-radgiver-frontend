import { z } from "zod/v4";
import { datoSchema, IAProsessStatusEnum } from "./domenetyper";

export const virksomhetsoversiktSchema = z.object({
    orgnr: z.string(),
    saksnummer: z.string().nullable(),
    virksomhetsnavn: z.string(),
    sykefraværsprosent: z.number(),
    antallPersoner: z.number(),
    muligeDagsverk: z.number(),
    tapteDagsverk: z.number(),
    status: IAProsessStatusEnum,
    eidAv: z.string().nullable(),
    sistEndret: datoSchema.nullable(),
});

export type Virksomhetsoversikt = z.infer<typeof virksomhetsoversiktSchema>;

const virksomhetsoversiktListeSchema = z.array(virksomhetsoversiktSchema);

export const virksomhetsoversiktListeResponsSchema = z.object({
    data: virksomhetsoversiktListeSchema,
});

export type VirksomhetsoversiktListeRespons = z.infer<
    typeof virksomhetsoversiktListeResponsSchema
>;

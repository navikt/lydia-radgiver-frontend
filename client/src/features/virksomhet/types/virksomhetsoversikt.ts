import { z } from "zod/v4";
import {
    datoSchema,
    IAProsessStatusEnum,
    VirksomhetIATilstandEnum,
} from "@/domenetyper/domenetyper";

export const virksomhetsoversiktSchema = z.object({
    orgnr: z.string(),
    saksnummer: z.string().nullable(),
    virksomhetsnavn: z.string(),
    sykefraværsprosent: z.number(),
    antallPersoner: z.number(),
    muligeDagsverk: z.number(),
    tapteDagsverk: z.number(),
    status: IAProsessStatusEnum,
    tilstand: VirksomhetIATilstandEnum,
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

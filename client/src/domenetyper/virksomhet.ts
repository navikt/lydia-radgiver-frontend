import { z } from "zod";

export const næringsgrupperSchema = z.object({
    navn: z.string(),
    kode: z.string(),
});

export type Næringsgruppe = z.infer<typeof næringsgrupperSchema>;

export const sektorSchema = z.object({
    kode: z.string(),
    beskrivelse: z.string()
})

export type Sektor = z.infer<typeof sektorSchema>;

const VIRKSOMHET_STATUS_BRREG = ["AKTIV", "FJERNET", "SLETTET"] as const;
export const VirksomhetStatusBrregEnum = z.enum(VIRKSOMHET_STATUS_BRREG);
export type VirksomhetStatusBrreg = z.infer<typeof VirksomhetStatusBrregEnum>;

export const virksomhetsSchema = z.object({
    orgnr: z.string(),
    navn: z.string(),
    adresse: z.string().array(),
    postnummer: z.string(),
    poststed: z.string(),
    næringsundergruppe1: næringsgrupperSchema,
    næringsundergruppe2: næringsgrupperSchema.nullable(),
    næringsundergruppe3: næringsgrupperSchema.nullable(),
    sektor: z.string().optional(),
    status: VirksomhetStatusBrregEnum,
});

export type Virksomhet = z.infer<typeof virksomhetsSchema>;

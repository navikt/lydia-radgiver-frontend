import { z } from "zod/v4";

export const næringsgrupperSchema = z.object({
    navn: z.string(),
    kode: z.string(),
});

export type Næringsgruppe = z.infer<typeof næringsgrupperSchema>;

export const næringSchema = z.object({
    navn: z.string(),
    kode: z.string(),
});

export type Næring = z.infer<typeof næringSchema>;

export const sektorSchema = z.object({
    kode: z.string(),
    beskrivelse: z.string(),
});

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
    næring: næringSchema,
    næringsundergruppe1: næringsgrupperSchema,
    næringsundergruppe2: næringsgrupperSchema.nullable(),
    næringsundergruppe3: næringsgrupperSchema.nullable(),
    bransje: z.string().nullable(),
    sektor: z.string().optional(),
    status: VirksomhetStatusBrregEnum,
    aktivtSaksnummer: z.string().nullable(),
});

export type Virksomhet = z.infer<typeof virksomhetsSchema>;

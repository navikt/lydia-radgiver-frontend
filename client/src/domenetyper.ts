import { z } from "zod";

export const fylkeOgKommuneSchema = z.object({
    nummer: z.string(),
    navn: z.string(),
});

export const fylkerMedKommunerSchema = z.object({
    fylke: fylkeOgKommuneSchema,
    kommuner: z.array(fylkeOgKommuneSchema),
});

export const næringsgrupperSchema = z.object({
    navn: z.string(),
    kode: z.string(),
});

export const filterverdierSchema = z.object({
    fylker: z.array(fylkerMedKommunerSchema),
    næringsgrupper: z.array(næringsgrupperSchema),
});

export const sykefraversstatistikkVirksomhetSchema = z.object({
    orgnr: z.string(),
    virksomhetsnavn: z.string(),
    sektor: z.string(),
    neringsgruppe: z.string(),
    arstall: z.number(),
    kvartal: z.number(),
    sykefraversprosent: z.number(),
    antallPersoner: z.number(),
    muligeDagsverk: z.number(),
    tapteDagsverk: z.number(),
});

export const sykefraversstatistikkVirksomhetListeSchema = z.array(
    sykefraversstatistikkVirksomhetSchema
);

export type FylkerMedKommuner = z.infer<typeof fylkerMedKommunerSchema>;

export type Filterverdier = z.infer<typeof filterverdierSchema>;

export type Næringsgruppe = z.infer<typeof næringsgrupperSchema>;

export type SykefraversstatistikkVirksomhet = z.infer<
    typeof sykefraversstatistikkVirksomhetSchema
>;

export interface Søkeverdier {
    kommuner?: Kommune[];
    fylker?: Fylke[];
    næringsgrupper?: Næringsgruppe[];
    sykefraværsprosentFra?: number;
    sykefraværsprosentTil?: number;
}

export type Virksomhet = {
    organisasjonsnummer: string;
    navn: string;
    beliggenhetsadresse: Beliggenhetsadresse;
};

export type Beliggenhetsadresse = {
    land: string;
    landkode: string;
    postnummer: string;
    poststed: string;
    kommune: string;
    kommunenummer: string;
};

export type Fylke = z.infer<typeof fylkeOgKommuneSchema>;
export type Kommune = z.infer<typeof fylkeOgKommuneSchema>;

import { z } from "zod/v4";

export const SYKEFRAVÆRSMÅLTYPER = [
    "LANGTIDSFRAVÆR",
    "KORTTIDSFRAVÆR",
    "EGENMELDT_FRAVÆR",
    "LEGEMELDT_FRAVÆR",
    "GRADERT_FRAVÆR",
    "TAPTE_DAGSVERK",
] as const;

export const SykefraværsmåltypeSchema = z.enum(SYKEFRAVÆRSMÅLTYPER);

export type Sykefraværsmåltype = z.infer<typeof SykefraværsmåltypeSchema>;

export const SykefraværsmålSchema = z.object({
    id: z.number().nullish(),
    type: SykefraværsmåltypeSchema,
    nåværende: z.number(),
    mål: z.number(),
    frist: z.string(),
});

export type Sykefraværsmål = z.infer<typeof SykefraværsmålSchema>;

export const SamarbeidsmålSchema = z.object({
    id: z.number().nullish(),
    mål: z.string(),
    lagretMedKiAdvarsel: z.boolean(),
});

export type Samarbeidsmål = z.infer<typeof SamarbeidsmålSchema>;

export const MålSchema = z.object({
    sykefraværsmål: z.array(SykefraværsmålSchema),
    samarbeidsmål: z.array(SamarbeidsmålSchema),
});

export type Mål = z.infer<typeof MålSchema>;

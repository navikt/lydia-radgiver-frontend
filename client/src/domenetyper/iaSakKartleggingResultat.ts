import { z } from "zod";
export const kartleggingSvarAlternativ = z.object({
    svarId: z.string(),
    tekst: z.string(),
    antallSvar: z.number(),
});

export const kartleggingSpørsmål = z.object({
    spørsmålId: z.string(),
    tekst: z.string(),
    flervalg: z.boolean(),
    svarListe: z.array(kartleggingSvarAlternativ),
});

const Temanavn = [
    "UTVIKLE_PARTSSAMARBEID",
    "REDUSERE_SYKEFRAVÆR",
    "ARBEIDSMILJØ",
] as const;
export const TemanavnEnum = z.enum(Temanavn);
export type TemanavnType = z.infer<typeof TemanavnEnum>;
export const spørsmålMedSvarPerTema = z.object({
    tema: TemanavnEnum,
    beskrivelse: z.string(),
    spørsmålMedSvar: z.array(kartleggingSpørsmål),
});

export const iaSakKartleggingResultatSchema = z.object({
    kartleggingId: z.string(),
    antallUnikeDeltakereMedMinstEttSvar: z.number(),
    antallUnikeDeltakereSomHarSvartPåAlt: z.number(),
    spørsmålMedSvarPerTema: z.array(spørsmålMedSvarPerTema),
});

export type IASakKartleggingResultat = z.infer<
    typeof iaSakKartleggingResultatSchema
>;

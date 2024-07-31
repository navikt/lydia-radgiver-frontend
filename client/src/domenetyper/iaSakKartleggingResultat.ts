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

export const spørsmålMedSvarPerTema = z.object({
    navn: z.string(),
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

import { z } from "zod";
export const kartleggingSvarAlternativ = z.object({
    svarId: z.string(),
    tekst: z.string(),
    antallSvar: z.number(),
});

export const kartleggingSpørsmål = z.object({
    spørsmålId: z.string(),
    tekst: z.string(),
    svarListe: z.array(kartleggingSvarAlternativ),
});

export const iaSakKartleggingResultatSchema = z.object({
    kartleggingId: z.string(),
    antallUnikeDeltakereMedMinstEttSvar: z.number(),
    spørsmålMedSvar: z.array(kartleggingSpørsmål),
});

export type IASakKartleggingResultat = z.infer<
    typeof iaSakKartleggingResultatSchema
>;

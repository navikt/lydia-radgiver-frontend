import { z } from "zod";
import { iaSakKartleggingStatusEnum } from "./domenetyper";

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
    status: iaSakKartleggingStatusEnum,
    spørsmålMedSvar: z.array(kartleggingSpørsmål),
});

export type IASakKartleggingResultat = z.infer<
    typeof iaSakKartleggingResultatSchema
>;

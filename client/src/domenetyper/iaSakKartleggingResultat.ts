import { z } from "zod";
export const svaralternativResultatSchema = z.object({
    svarId: z.string(),
    tekst: z.string(),
    antallSvar: z.number(),
});

export const spørsmålResultatSchema = z.object({
    spørsmålId: z.string(),
    tekst: z.string(),
    flervalg: z.boolean(),
    antallDeltakereSomHarSvart: z.number(),
    svarListe: z.array(svaralternativResultatSchema),
});

export type SpørsmålResultatDto = z.infer<typeof spørsmålResultatSchema>;

export const temaResultatSchema = z.object({
    navn: z.string(),
    spørsmålMedSvar: z.array(spørsmålResultatSchema),
});

export type TemaResultatDto = z.infer<typeof temaResultatSchema>;

export const behovsvurderingResultatSchema = z.object({
    kartleggingId: z.string(),
    antallUnikeDeltakereMedMinstEttSvar: z.number(),
    antallUnikeDeltakereSomHarSvartPåAlt: z.number(),
    spørsmålMedSvarPerTema: z.array(temaResultatSchema),
});

export type IASakKartleggingResultat = z.infer<
    typeof behovsvurderingResultatSchema
>;

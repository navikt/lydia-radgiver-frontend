import { z } from "zod";

export const svaralternativResultatSchema = z.object({
    id: z.string(),
    tekst: z.string(),
    antallSvar: z.number(),
});

export type SvaralternativResultat = z.infer<typeof spørsmålResultatSchema>;

export const spørsmålResultatSchema = z.object({
    id: z.string(),
    tekst: z.string(),
    flervalg: z.boolean(),
    antallDeltakereSomHarSvart: z.number(),
    svarListe: z.array(svaralternativResultatSchema),
});
export type SpørsmålResultat = z.infer<typeof spørsmålResultatSchema>;

export const temaResultatSchema = z.object({
    id: z.number(),
    navn: z.string(),
    spørsmålMedSvar: z.array(spørsmålResultatSchema),
});

export type TemaResultat = z.infer<typeof temaResultatSchema>;

export const spørreundersøkelseResultatSchema = z.object({
    id: z.string(),
    spørsmålMedSvarPerTema: z.array(temaResultatSchema),
});

export type SpørreundersøkelseResultat = z.infer<
    typeof spørreundersøkelseResultatSchema
>;

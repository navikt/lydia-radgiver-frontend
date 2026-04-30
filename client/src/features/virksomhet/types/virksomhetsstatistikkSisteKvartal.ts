import { z } from "zod/v4";

export const virksomhetsstatistikkSisteKvartalSchema = z.object({
    orgnr: z.string(),
    arstall: z.number(),
    kvartal: z.number(),
    antallPersoner: z.number(),
    tapteDagsverk: z.number(),
    muligeDagsverk: z.number(),
    sykefraværsprosent: z.number(),
    graderingsprosent: z.number().nullish(),
    maskert: z.boolean(),
});

export type VirkomshetsstatistikkSisteKvartal = z.infer<
    typeof virksomhetsstatistikkSisteKvartalSchema
>;

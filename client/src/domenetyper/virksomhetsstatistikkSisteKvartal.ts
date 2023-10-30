import { z } from "zod";

export const virksomhetsstatistikkSisteKvartalSchema = z.object({
    orgnr: z.string(),
    arstall: z.number(),
    kvartal: z.number(),
    antallPersoner: z.number(),
    tapteDagsverk: z.number(),
    muligeDagsverk: z.number(),
    sykefraversprosent: z.number(),
    graderingsprosent: z.number(),
    maskert: z.boolean(),
});

export type VirkomshetsstatistikkSisteKvartal = z.infer<typeof virksomhetsstatistikkSisteKvartalSchema>;

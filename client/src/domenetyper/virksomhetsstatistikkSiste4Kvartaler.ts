import { z } from "zod";
import { kvartalSchema } from "./kvartal";

export const virksomhetsstatistikkSiste4KvartalerSchema = z.object({
    orgnr: z.string(),
    sykefraværsprosent: z.number(),
    graderingsprosent: z.number().nullish(),
    muligeDagsverk: z.number(),
    tapteDagsverk: z.number(),
    antallKvartaler: z.number(),
    kvartaler: z.array(kvartalSchema),
})

export type VirksomhetsstatistikkSiste4Kvartaler = z.infer<typeof virksomhetsstatistikkSiste4KvartalerSchema>;

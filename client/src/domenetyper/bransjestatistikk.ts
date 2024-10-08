import { z } from "zod";
import { kvartalSchema } from "./kvartal";

const sistePubliserteKvartalSchema = z.object({
    årstall: z.number().int(),
    kvartal: z.number().int(),
    prosent: z.number().nullable(),
    tapteDagsverk: z.number().nullable(),
    muligeDagsverk: z.number().nullable(),
    antallPersoner: z.number().int().nullable(),
    erMaskert: z.boolean(),
});

const siste4KvartalSchema = z.object({
    prosent: z.number().nullable(),
    tapteDagsverk: z.number().nullable(),
    muligeDagsverk: z.number().nullable(),
    erMaskert: z.boolean(),
    kvartaler: z.array(kvartalSchema),
});

export const bransjestatistikkSchema = z.object({
    bransje: z.string(),
    sisteGjeldendeKvartal: sistePubliserteKvartalSchema,
    siste4Kvartal: siste4KvartalSchema,
});

export type Bransjestatistikk = z.infer<typeof bransjestatistikkSchema>;

export const næringsstatistikkSchema = z.object({
    næring: z.string(),
    sisteGjeldendeKvartal: sistePubliserteKvartalSchema,
    siste4Kvartal: siste4KvartalSchema,
});

export type Næringsstatistikk = z.infer<typeof næringsstatistikkSchema>;

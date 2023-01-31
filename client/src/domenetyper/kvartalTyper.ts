import { z } from "zod";

export const kvartalSchema = z.object({
    kvartal: z.number(),
    årstall: z.number(),
})

export type Kvartal = z.infer<typeof kvartalSchema>;

export const kvartalFraTilSchema = z.object({
    fra: kvartalSchema,
    til: kvartalSchema,
})

export type KvartalFraTil = z.infer<typeof kvartalFraTilSchema>;

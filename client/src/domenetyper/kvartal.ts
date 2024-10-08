import { z } from "zod";

export const kvartalSchema = z.object({
    kvartal: z.number(),
    årstall: z.number(),
});

export type Kvartal = z.infer<typeof kvartalSchema>;

export const kvartalFraTilSchema = z.object({
    fra: kvartalSchema,
    til: kvartalSchema,
});

export const nesteKvartal = (kvartal: Kvartal) => {
    if (kvartal.kvartal == 4) {
        return {
            årstall: kvartal.årstall + 1,
            kvartal: 1,
        };
    }
    return {
        årstall: kvartal.årstall,
        kvartal: kvartal.kvartal + 1,
    };
};

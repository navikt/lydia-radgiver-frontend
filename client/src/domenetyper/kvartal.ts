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

export const nesteKvartal = (kvartal: Kvartal) => {
    if (kvartal.kvartal == 4) {
        return {
            årstall: kvartal.årstall + 1,
            kvartal: 1
        }
    }
    return {
        årstall: kvartal.årstall,
        kvartal: kvartal.kvartal + 1
    }
}

export const forrigeKvartal = (kvartal : Kvartal) : Kvartal => {
    if (kvartal.kvartal === 1) {
        return {
            kvartal: 4,
            årstall: kvartal.årstall -1,
        }
    } else {
        return {
            kvartal: kvartal.kvartal -1,
            årstall: kvartal.årstall,
        }
    }
}

const rekursivtLagKvartaler = (
    kvartaler: Kvartal[],
    kvartal: Kvartal,
    kvartalerIgjen: number,
): Kvartal[] => {
    if (kvartalerIgjen === 0) {
        return kvartaler
    } else {
        kvartaler.push(kvartal)
        return rekursivtLagKvartaler(kvartaler, forrigeKvartal(kvartal), kvartalerIgjen - 1)
    }
}

export const lagKvartaler = (fraKvartal: Kvartal, antall: number): Kvartal[] => {
    return rekursivtLagKvartaler([], fraKvartal, antall)
}

export type KvartalFraTil = z.infer<typeof kvartalFraTilSchema>;

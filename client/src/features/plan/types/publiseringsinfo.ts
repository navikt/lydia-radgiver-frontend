import { z } from "zod/v4";
import { kvartalFraTilSchema } from "@/domenetyper/kvartal";

export const publiseringsinfoSchema = z.object({
    sistePubliseringsdato: z.string(),
    nestePubliseringsdato: z.string(),
    fraTil: kvartalFraTilSchema,
});

export type Publiseringsinfo = z.infer<typeof publiseringsinfoSchema>;

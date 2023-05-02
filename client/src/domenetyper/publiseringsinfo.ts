import { z } from "zod";
import { kvartalFraTilSchema } from "./kvartal";

export const publiseringsinfoSchema = z.object({
    sistePubliseringsdato: z.string(),
    nestePubliseringsdato: z.string(),
    fraTil: kvartalFraTilSchema
})

export type Publiseringsinfo = z.infer<typeof publiseringsinfoSchema>;

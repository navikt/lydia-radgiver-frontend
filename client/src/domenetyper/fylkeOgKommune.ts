import { z } from "zod";

const fylkeOgKommuneSchema = z.object({
    nummer: z.string(),
    navn: z.string(),
});

export type Fylke = z.infer<typeof fylkeOgKommuneSchema>;
export type Kommune = z.infer<typeof fylkeOgKommuneSchema>;

export const fylkeMedKommunerSchema = z.object({
    fylke: fylkeOgKommuneSchema,
    kommuner: z.array(fylkeOgKommuneSchema),
});

export type FylkeMedKommuner = z.infer<typeof fylkeMedKommunerSchema>;

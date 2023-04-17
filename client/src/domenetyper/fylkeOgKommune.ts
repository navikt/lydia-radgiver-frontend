import { z } from "zod";

const kommuneSchema = z.object({
    nummer: z.string(),
    navn: z.string(),
    navnNorsk: z.string(),
});

const fylkeSchema = z.object({
    nummer: z.string(),
    navn: z.string(),
});

export type Fylke = z.infer<typeof fylkeSchema>;
export type Kommune = z.infer<typeof kommuneSchema>;

export const fylkeMedKommunerSchema = z.object({
    fylke: fylkeSchema,
    kommuner: z.array(kommuneSchema),
});

export type FylkeMedKommuner = z.infer<typeof fylkeMedKommunerSchema>;

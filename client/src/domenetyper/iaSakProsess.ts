import {z} from "zod";

export const iaSakProsessSchema = z.object({
    id: z.number(),
    saksnummer: z.string(),
    navn: z.string().nullable(),
    status: z.string(),
});

export type IaSakProsess = z.infer<typeof iaSakProsessSchema>;
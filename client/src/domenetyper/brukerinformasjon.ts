import { z } from "zod";

const ROLLE = ["Superbruker", "Saksbehandler", "Lesetilgang"] as const;
export const RolleEnum = z.enum(ROLLE);
export type Rolle = z.infer<typeof RolleEnum>;

export const brukerinformasjonSchema = z.object({
    navn: z.string(),
    ident: z.string(),
    epost: z.string(),
    tokenUtloper: z.number(),
    rolle: RolleEnum,
});

export type Brukerinformasjon = z.infer<typeof brukerinformasjonSchema>;

import { z } from "zod/v4";

export const brukerITeamSchema = z.object({
    ident: z.string(),
    saksnummer: z.string(),
});

export type BrukerITeamDTO = z.infer<typeof brukerITeamSchema>;

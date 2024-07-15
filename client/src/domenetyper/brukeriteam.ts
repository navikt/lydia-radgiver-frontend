import { z } from "zod";

export const brukerITeamSchema = z.object({
    ident: z.string(),
    saksnummer: z.string(),
});

export type BrukerITeamDTO = z.infer<typeof brukerITeamSchema>;

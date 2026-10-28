import { z } from "zod/v4";
import { nyFlytApiBasePath } from "./paths";
import { post } from "./networkRequests";

const personopplysningssjekkResultatSchema = z.object({
    kanInneholdePersonopplysninger: z.boolean(),
    inneholderTall: z.boolean(),
    inneholderEpost: z.boolean(),
    kiFlagget: z.boolean().nullable(),
});

export type PersonopplysningssjekkResultat = z.infer<
    typeof personopplysningssjekkResultatSchema
>;

export const sjekkPersonopplysninger = (
    orgnummer: string,
    saksnummer: string,
    tekst: string,
) =>
    post(
        `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/personopplysningssjekk`,
        personopplysningssjekkResultatSchema,
        { tekst },
    );

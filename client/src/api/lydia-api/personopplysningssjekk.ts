import { z } from "zod/v4";
import { nyFlytApiBasePath } from "./paths";
import { post } from "./networkRequests";

export const personopplysningssjekkPath = `${nyFlytApiBasePath}/personopplysningssjekk`;

const personopplysningssjekkResultatSchema = z.object({
    inneholderTall: z.boolean(),
    inneholderEpost: z.boolean(),
});

export type PersonopplysningssjekkResultat = z.infer<
    typeof personopplysningssjekkResultatSchema
>;

export const sjekkPersonopplysninger = (tekst: string) =>
    post(personopplysningssjekkPath, personopplysningssjekkResultatSchema, {
        tekst,
    });

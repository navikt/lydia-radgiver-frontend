import { z } from "zod";
import { temaResultatSchema } from "./iaSakSpørreundersøkelse";

export const behovsvurderingResultatSchema = z.object({
    kartleggingId: z.string(),
    spørsmålMedSvarPerTema: z.array(temaResultatSchema),
});

export type IASakKartleggingResultat = z.infer<
    typeof behovsvurderingResultatSchema
>;

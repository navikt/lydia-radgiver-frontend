import { z } from "zod";
import { temaResultatSchema } from "./iaSakSpørreundersøkelse";

export const evalueringResultatSchema = z.object({
    kartleggingId: z.string(),
    spørsmålMedSvarPerTema: z.array(temaResultatSchema),
});

export type IASakEvalueringResultat = z.infer<typeof evalueringResultatSchema>;

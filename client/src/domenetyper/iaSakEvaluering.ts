import { z } from "zod";
import { datoSchema, spørreundersøkelseStatusEnum } from "./domenetyper";

export const iaSakEvalueringSchema = z.object({
    kartleggingId: z.string(),
    prosessId: z.number(),
    status: spørreundersøkelseStatusEnum,
    opprettetAv: z.string(),
    opprettetTidspunkt: datoSchema,
    endretTidspunkt: datoSchema.nullable(),
});

export type IASakEvaluering = z.infer<typeof iaSakEvalueringSchema>;

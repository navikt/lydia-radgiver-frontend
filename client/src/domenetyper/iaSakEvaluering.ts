import { z } from "zod";
import { datoSchema, iaSakKartleggingStatusEnum } from "./domenetyper";

export const iaSakEvalueringSchema = z.object({
    kartleggingId: z.string(),
    prosessId: z.number(),
    status: iaSakKartleggingStatusEnum,
    opprettetAv: z.string(),
    opprettetTidspunkt: datoSchema,
    endretTidspunkt: datoSchema.nullable(),
});

export type IASakEvaluering = z.infer<typeof iaSakEvalueringSchema>;

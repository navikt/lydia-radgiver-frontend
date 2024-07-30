import { z } from "zod";
import { datoSchema, iaSakKartleggingStatusEnum } from "./domenetyper";

export const iaSakKartleggingSchema = z.object({
    kartleggingId: z.string(),
    status: iaSakKartleggingStatusEnum,
    opprettetAv: z.string(),
    opprettetTidspunkt: datoSchema,
    endretTidspunkt: datoSchema.nullable(),
});

export type IASakKartlegging = z.infer<typeof iaSakKartleggingSchema>;

import { z } from "zod";
import { iaSakKartleggingStatusEnum } from "./domenetyper";

export const iaSakKartleggingSchema = z.object({
    kartleggingId: z.string(),
    status: iaSakKartleggingStatusEnum,
});

export type IASakKartlegging = z.infer<typeof iaSakKartleggingSchema>;

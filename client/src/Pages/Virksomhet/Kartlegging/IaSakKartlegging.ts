import { z } from "zod";

export const iaSakKartleggingSchema = z.object({
    kartleggingId: z.string(),
    status: z.string(),
});

export type iaSakKartlegging = z.infer<typeof iaSakKartleggingSchema>;

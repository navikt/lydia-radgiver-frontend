import { z } from "zod";

export const iaSakKartleggingSchema = z.object({
    id: z.string(),
    status: z.string(),
});

export type iaSakKartlegging = z.infer<typeof iaSakKartleggingSchema>;

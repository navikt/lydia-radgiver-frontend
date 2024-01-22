import { z } from "zod";

export const IASakKartleggingSchema = z.object({
    id: z.number(),
    status: z.string(),
});

export type IASakKartlegging = z.infer<typeof IASakKartleggingSchema>;

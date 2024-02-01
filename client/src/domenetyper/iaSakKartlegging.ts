import { z } from "zod";

const KARTLEGGING_STATUSER = ["OPPRETTET", "AVSLUTTET"] as const;
const kartleggingStatusEnum = z.enum(KARTLEGGING_STATUSER);

export const iaSakKartleggingSchema = z.object({
    kartleggingId: z.string(),
    status: kartleggingStatusEnum,
});

export type IASakKartlegging = z.infer<typeof iaSakKartleggingSchema>;

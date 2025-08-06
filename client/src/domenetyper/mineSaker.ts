import { z } from "zod/v4";
import { iaSakSchema } from "./domenetyper";

export const mineSakerSchema = z.object({
    iaSak: iaSakSchema,
    orgnavn: z.string(),
});

export type MineSaker = z.infer<typeof mineSakerSchema>;
export const mineSakerListSchema = z.array(mineSakerSchema);

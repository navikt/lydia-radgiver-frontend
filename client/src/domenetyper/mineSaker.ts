import { z } from "zod";
import { iaSakSchema } from "./domenetyper";

export const mineSakerSchema = z.object({
    iaSak: iaSakSchema,
    orgnavn: z.string(),
});

export type MineSaker = z.infer<typeof mineSakerSchema>;
export const mineSakerListSchema = z.array(mineSakerSchema);

import { z } from "zod/v4";
import { iaSakSchema, VirksomhetIATilstandEnum } from "./domenetyper";

export const mineSakerSchema = z.object({
    iaSak: iaSakSchema,
    orgnavn: z.string(),
    virksomhetTilstand: VirksomhetIATilstandEnum,
});

export type MineSaker = z.infer<typeof mineSakerSchema>;
export const mineSakerListSchema = z.array(mineSakerSchema);

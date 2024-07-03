import { z } from "zod";
import { IAProsessStatusEnum } from "./domenetyper";

export const mineSakerSchema = z.object({
    orgnr: z.string(),
    status: IAProsessStatusEnum,
    saksnummer: z.string(),
    orgnavn: z.string(),
});

export type MineSaker = z.infer<typeof mineSakerSchema>;
export const mineSakerListSchema = z.array(mineSakerSchema);

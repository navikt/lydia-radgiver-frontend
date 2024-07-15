import { z } from "zod";
import { IAProsessStatusEnum, datoSchema } from "./domenetyper";

export const mineSakerSchema = z.object({
    orgnr: z.string(),
    status: IAProsessStatusEnum,
    saksnummer: z.string(),
    orgnavn: z.string(),
    eidAv: z.string().nullable(),
    endretTidspunkt: datoSchema,
});

export type MineSaker = z.infer<typeof mineSakerSchema>;
export const mineSakerListSchema = z.array(mineSakerSchema);

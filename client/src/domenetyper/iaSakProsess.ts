import { z } from "zod";
import { IAProsessStatusEnum } from "./domenetyper";

export const iaSakProsessSchema = z.object({
    id: z.number(),
    saksnummer: z.string(),
    navn: z.string().nullable(),
    status: IAProsessStatusEnum,
});

export type IaSakProsess = z.infer<typeof iaSakProsessSchema>;
export const DEFAULT_SAMARBEIDSNAVN = "Samarbeid uten navn";
export const defaultNavnHvisTomt = (
    navn: string | null | undefined,
): string => {
    return navn?.trim() || DEFAULT_SAMARBEIDSNAVN;
};

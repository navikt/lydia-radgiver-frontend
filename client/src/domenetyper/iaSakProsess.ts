import { z } from "zod";

const IA_SAMARBEID_STATUS = [
    "AKTIV",
    "FULLFØRT",
    "SLETTET",
] as const;

export const IASamarbeidStatusEnum = z.enum(IA_SAMARBEID_STATUS);

export type IASamarbeidStatusType = z.infer<typeof IASamarbeidStatusEnum>;

export const iaSakProsessSchema = z.object({
    id: z.number(),
    saksnummer: z.string(),
    navn: z.string().nullable(),
    status: IASamarbeidStatusEnum,
});

export type IaSakProsess = z.infer<typeof iaSakProsessSchema>;
export const DEFAULT_SAMARBEIDSNAVN = "Samarbeid uten navn";
export const defaultNavnHvisTomt = (
    navn: string | null | undefined,
): string => {
    return navn?.trim() || DEFAULT_SAMARBEIDSNAVN;
};

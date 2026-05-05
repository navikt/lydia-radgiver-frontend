import { z } from "zod/v4";
import { datoSchema } from "./domenetyper";

const IA_SAMARBEID_STATUS = [
    "AKTIV",
    "FULLFØRT",
    "SLETTET",
    "AVBRUTT",
] as const;

export const IASamarbeidStatusEnum = z.enum(IA_SAMARBEID_STATUS);

export type IASamarbeidStatusType = z.infer<typeof IASamarbeidStatusEnum>;

// TODO: Endre navn til iaSamarbeidSchema, ettersom navnet brukt i backend er IASamarbeidDto
export const iaSakProsessSchema = z.object({
    id: z.number(),
    saksnummer: z.string(),
    navn: z.string().nullable(),
    status: IASamarbeidStatusEnum,
    sistEndret: datoSchema.nullable().optional(),
    opprettet: datoSchema.nullable().optional(),
});

export type IaSakProsess = z.infer<typeof iaSakProsessSchema>;

export type SamarbeidRequest = {
    id: number;
    navn: string | null;
    status: IASamarbeidStatusType;
    startDato: string | null;
    sluttDato: string | null;
    endretTidspunkt: string | null;
};

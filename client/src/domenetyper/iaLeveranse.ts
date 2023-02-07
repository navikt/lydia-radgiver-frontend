import { z } from "zod";
import { datoSchema } from "./domenetyper";

const iaTjenesteSchema = z.object({
    id: z.number(),
    navn: z.string()
})

export type IATjeneste = z.infer<typeof iaTjenesteSchema>;

const iaTjenesteModulSchema = z.object({
    id: z.number(),
    iaTjeneste: z.number(),
    navn: z.string(),
})

export type IATjenesteModul = z.infer<typeof iaTjenesteModulSchema>;

const IA_SAK_LEVERANSE_STATUSER = [
    "UNDER_ARBEID",
    "LEVERT",
    // "AVBRUTT"?
] as const;

export const IASakLeveranseStatusEnum = z.enum(IA_SAK_LEVERANSE_STATUSER);

type IASakLeveranseStatus = z.infer<typeof IASakLeveranseStatusEnum>

export const iaSakLeveranseSchema = z.object({
    id: z.number(),
    saksnummer: z.string(),
    modul: z.object({
        id: z.number(),
        iaTjeneste: iaTjenesteSchema,
        navn: z.string(),
    }),
    frist: datoSchema,
    status: IASakLeveranseStatusEnum,
})

export type IASakLeveranse = z.infer<typeof iaSakLeveranseSchema>

export interface NyIASakLeveranseDTO {
    saksnummer: string;
    modulId: number;
    frist: string; // isoDato(Date) -> string
}

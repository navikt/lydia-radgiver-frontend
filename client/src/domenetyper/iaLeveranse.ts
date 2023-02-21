import { z } from "zod";
import { datoSchema } from "./domenetyper";

export const iaTjenesteSchema = z.object({
    id: z.number(),
    navn: z.string()
})

export type IATjeneste = z.infer<typeof iaTjenesteSchema>;

export const iaTjenesteModulSchema = z.object({
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
    modul: iaTjenesteModulSchema,
    frist: datoSchema,
    status: IASakLeveranseStatusEnum,
    fullført: datoSchema.optional().nullable(),
})

export type IASakLeveranse = z.infer<typeof iaSakLeveranseSchema>

export const iaSakLeveranserPerTjenesteSchema = z.object({
    iaTjeneste: iaTjenesteSchema,
    leveranser: z.array(iaSakLeveranseSchema),
})

export type IASakLeveranserPerTjeneste = z.infer<typeof iaSakLeveranserPerTjenesteSchema>

export interface NyIASakLeveranseDTO {
    saksnummer: string;
    modulId: number;
    frist: string; // isoDato(Date) -> string
}

const iaSakLeveranseOppdateringDTOSchema = z.object({
    status: IASakLeveranseStatusEnum.nullable(),
})

export type IASakLeveranseOppdateringDTO = z.infer<typeof iaSakLeveranseOppdateringDTOSchema>

import { z } from "zod";
import { datoSchema } from "./domenetyper";

export const iaTjenesteSchema = z.object({
    id: z.number(),
    navn: z.string(),
    deaktivert: z.boolean(),
})

export type IATjeneste = z.infer<typeof iaTjenesteSchema>;

export const modulSchema = z.object({
    id: z.number(),
    iaTjeneste: z.number(),
    navn: z.string(),
    deaktivert: z.boolean(),
})

export type Modul = z.infer<typeof modulSchema>;

const LEVERANSE_STATUSER = [
    "UNDER_ARBEID",
    "LEVERT",
] as const;

export const LeveranseStatusEnum = z.enum(LEVERANSE_STATUSER);

export const leveranseSchema = z.object({
    id: z.number(),
    saksnummer: z.string(),
    modul: modulSchema,
    frist: datoSchema,
    status: LeveranseStatusEnum,
    fullført: datoSchema.nullable(),
})

export type Leveranse = z.infer<typeof leveranseSchema>

export const mineIATjenesterSchema = z.object({
    orgnr: z.string(),
    virksomhetsnavn: z.string(),
    iaTjeneste: iaTjenesteSchema,
    modul: modulSchema,
    tentativFrist: datoSchema,
    status: LeveranseStatusEnum,
});

export type MineIATjenester = z.infer<typeof mineIATjenesterSchema>;

export const leveranserPerIATjenesteSchema = z.object({
    iaTjeneste: iaTjenesteSchema,
    leveranser: z.array(leveranseSchema),
})

export type LeveranserPerIATjeneste = z.infer<typeof leveranserPerIATjenesteSchema>

export interface NyLeveranseDTO {
    saksnummer: string;
    modulId: number;
    frist: string; // isoDato(Date) -> string
}

const leveranseOppdateringDTOSchema = z.object({
    status: LeveranseStatusEnum.nullable(),
})

export type LeveranseOppdateringDTO = z.infer<typeof leveranseOppdateringDTOSchema>

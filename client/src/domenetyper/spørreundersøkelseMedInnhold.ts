import { z } from "zod/v4";
import { datoSchema, spørreundersøkelseStatusEnum } from "./domenetyper";

const SPØRREUNDERSØKELSE_TYPE = ["BEHOVSVURDERING", "EVALUERING"] as const;
export const SpørreundersøkelseTypeEnum = z.enum(SPØRREUNDERSØKELSE_TYPE);
export type SpørreundersøkelseType = z.infer<typeof SpørreundersøkelseTypeEnum>;

export const SvaralternativSchema = z.object({
    svarId: z.string(),
    svartekst: z.string(),
});
export type SvaralternativDto = z.infer<typeof SvaralternativSchema>;

export const SpørsmålSchema = z.object({
    id: z.string(),
    undertemanavn: z.string(),
    spørsmål: z.string(),
    svaralternativer: z.array(SvaralternativSchema),
    flervalg: z.boolean(),
});
export type SpørsmålDto = z.infer<typeof SpørsmålSchema>;

export const TemaSchema = z.object({
    temaId: z.number(),
    navn: z.string(),
    spørsmålOgSvaralternativer: z.array(SpørsmålSchema),
});
export type TemaDto = z.infer<typeof TemaSchema>;

export const SpørreundersøkelseMedInnholdSchema = z.object({
    id: z.string(),
    samarbeidId: z.number(),
    status: spørreundersøkelseStatusEnum,
    temaer: z.array(TemaSchema),
    opprettetAv: z.string(),
    type: SpørreundersøkelseTypeEnum,
    opprettetTidspunkt: datoSchema,
    endretTidspunkt: datoSchema.nullable(),
    påbegyntTidspunkt: datoSchema.nullable(),
    fullførtTidspunkt: datoSchema.nullable(),
});
export type SpørreundersøkelseMedInnhold = z.infer<
    typeof SpørreundersøkelseMedInnholdSchema
>;

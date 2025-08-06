import { z } from "zod/v4";
import {
    datoSchema,
    DokumentStatusEnum,
    spørreundersøkelseStatusEnum,
} from "./domenetyper";
import { SpørreundersøkelseTypeEnum } from "./spørreundersøkelseMedInnhold";

export const spørreundersøkelseSchema = z.object({
    id: z.string(),
    samarbeidId: z.number(),
    status: spørreundersøkelseStatusEnum,
    publiseringStatus: DokumentStatusEnum.optional(),
    opprettetAv: z.string(),
    type: SpørreundersøkelseTypeEnum,
    opprettetTidspunkt: datoSchema,
    endretTidspunkt: datoSchema.nullable(),
    påbegyntTidspunkt: datoSchema.nullable(),
    fullførtTidspunkt: datoSchema.nullable(),
    gyldigTilTidspunkt: datoSchema,
    harMinstEttResultat: z.boolean().optional(),
});

export type Spørreundersøkelse = z.infer<typeof spørreundersøkelseSchema>;

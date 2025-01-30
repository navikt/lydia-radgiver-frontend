import { z } from "zod";
import { datoSchema, spørreundersøkelseStatusEnum } from "./domenetyper";

export const spørreundersøkelseSchema = z.object({
    id: z.string(),
    samarbeidId: z.number(),
    status: spørreundersøkelseStatusEnum,
    opprettetAv: z.string(),
    opprettetTidspunkt: datoSchema,
    endretTidspunkt: datoSchema.nullable(),
    påbegyntTidspunkt: datoSchema.nullable(),
    fullførtTidspunkt: datoSchema.nullable(),
    gyldigTilTidspunkt: datoSchema,
});

export type Spørreundersøkelse = z.infer<typeof spørreundersøkelseSchema>;

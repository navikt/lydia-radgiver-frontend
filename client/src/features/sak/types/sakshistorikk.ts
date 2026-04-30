import { z } from "zod/v4";
import { datoSchema, IAProsessStatusEnum } from "@/domenetyper/domenetyper";
import { iaSakProsessSchema } from "@features/sak/types/iaSakProsess";

const sakshendelseSchema = z.object({
    status: IAProsessStatusEnum,
    hendelsestype: z.string(),
    tidspunktForSnapshot: datoSchema,
    begrunnelser: z.string().array(),
    eier: z.string().nullable(),
    hendelseOpprettetAv: z.string(),
});
export const sakshistorikkSchema = z.object({
    saksnummer: z.string(),
    opprettet: datoSchema,
    sistEndret: datoSchema,
    sakshendelser: sakshendelseSchema.array(),
    samarbeid: iaSakProsessSchema.array(),
});

export type Sakshistorikk = z.infer<typeof sakshistorikkSchema>;

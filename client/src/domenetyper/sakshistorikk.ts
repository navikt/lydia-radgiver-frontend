import { z } from "zod";
import { datoSchema, IAProsessStatusEnum, IASakshendelseTypeEnum } from "./domenetyper";

const sakshendelseSchema = z.object({
    status: IAProsessStatusEnum,
    hendelsestype: IASakshendelseTypeEnum,
    tidspunktForSnapshot: datoSchema,
    begrunnelser: z.string().array(),
    eier: z.string().nullable(),
});
export const sakshistorikkSchema = z.object({
    saksnummer: z.string(),
    opprettet: datoSchema,
    sistEndret: datoSchema, // TODO endre til obligatorisk når backend sender dette feltet
    sakshendelser: sakshendelseSchema.array(),
});

export type Sakshistorikk = z.infer<typeof sakshistorikkSchema>;

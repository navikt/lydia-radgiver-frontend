import { z } from "zod";
import { datoSchema, IAProsessStatusEnum, IASakshendelseTypeEnum } from "./domenetyper";

const sakSnapshotSchema = z.object({
    status: IAProsessStatusEnum,
    hendelsestype: IASakshendelseTypeEnum,
    tidspunktForSnapshot: datoSchema,
    begrunnelser: z.string().array(),
    eier: z.string().nullable(),
});
export const sakshistorikkSchema = z.object({
    saksnummer: z.string(),
    opprettet: datoSchema,
    sistEndret: datoSchema.optional(), // TODO endre til obligatorisk når backend sender dette feltet
    sakshendelser: sakSnapshotSchema.array(),
});

export type Sakshistorikk = z.infer<typeof sakshistorikkSchema>;

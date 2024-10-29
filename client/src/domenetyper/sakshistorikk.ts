import { z } from "zod";
import {
    datoSchema,
    IAProsessStatusEnum,
    IASakshendelseTypeEnum,
} from "./domenetyper";

const sakshendelseSchema = z.object({
    status: IAProsessStatusEnum,
    hendelsestype: IASakshendelseTypeEnum,
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
});

export type Sakshendelse = z.infer<typeof sakshendelseSchema>;
export type Sakshistorikk = z.infer<typeof sakshistorikkSchema>;

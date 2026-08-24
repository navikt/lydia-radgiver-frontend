import { z } from "zod/v4";
import {
    datoSchema,
    IAProsessStatusEnum,
    IASakshendelseTypeEnum,
} from "./domenetyper";

export const årsakSchema = z.object({
    beskrivelse: z.string(),
    begrunnelser: z.string().array(),
});

export const historikkHendelseSchema = z.object({
    hendelse_id: z.string(),
    hendelse_type: IASakshendelseTypeEnum,
    resulterende_status: IAProsessStatusEnum,
    tidspunkt: datoSchema,
    hendelse_opprettet_av: z.string(),
    årsak: årsakSchema.nullable().optional(),
});

export const historikklinjeSchema = z.object({
    beskrivelse: z.string(),
    tidspunkt: datoSchema.nullable().optional(),
    relatertHendelse: historikkHendelseSchema.nullable().optional(),
});

export const samarbeidsperiodeSchema = z.object({
    saksnummer: z.string(),
    fraDato: datoSchema,
    status: IAProsessStatusEnum,
    eier: z.string().nullable().optional(),
});

export const virksomhetshistorikkSchema = z.object({
    hendelser: historikklinjeSchema.array(),
    samarbeidsperioder: samarbeidsperiodeSchema.array(), //
});

export type Virksomhetshistorikk = z.infer<typeof virksomhetshistorikkSchema>;

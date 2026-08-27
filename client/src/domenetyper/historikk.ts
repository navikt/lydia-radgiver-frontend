import { z } from "zod/v4";
import {
    datoSchema,
    IAProsessStatusEnum,
    IASakshendelseTypeEnum,
} from "./domenetyper";
import { iaSakProsessSchema } from "./iaSakProsess";

export const årsakSchema = z.object({
    beskrivelse: z.string(),
    begrunnelser: z.string().array(),
});

export const historikkHendelseSchema = z.object({
    hendelse_id: z.string(),
    hendelsetype: IASakshendelseTypeEnum,
    resulterende_status: IAProsessStatusEnum,
    tidspunkt: datoSchema,
    hendelse_opprettet_av: z.string(),
    årsak: årsakSchema.nullable().optional(),
    versjon: z.string(),
});

export const historikklinjeSchema = z.object({
    beskrivelse: z.string(),
    tidspunkt: datoSchema.nullable().optional(),
    relatert_hendelse: historikkHendelseSchema.nullable().optional(),
});

export type Historikklinje = z.infer<typeof historikklinjeSchema>;

export const samarbeidsperiodeSchema = z.object({
    saksnummer: z.string(),
    fraDato: datoSchema,
    status: IAProsessStatusEnum,
    eier: z.string().nullable().optional(),
});

export type Samarbeidsperiode = z.infer<typeof samarbeidsperiodeSchema>;

export const virksomhetshistorikkSchema = z.object({
    hendelser: historikklinjeSchema.array(),
    samarbeidsperioder: samarbeidsperiodeSchema.array(), //
});

export type Virksomhetshistorikk = z.infer<typeof virksomhetshistorikkSchema>;

export const samarbeidsperiodeHistorikkSchema = z.object({
    saksnummer: z.string(),
    opprettet: datoSchema,
    sistEndret: datoSchema,
    historikkHendelser: historikkHendelseSchema.array(),
    samarbeid: iaSakProsessSchema.array(),
});

export type SamarbeidsperiodeHistorikk = z.infer<
    typeof samarbeidsperiodeHistorikkSchema
>;

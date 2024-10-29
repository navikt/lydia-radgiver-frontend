import { z } from "zod";

export const datoSchema = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date()) as z.ZodEffects<z.ZodDate, Date, Date>;

export const eierSchema = z.object({
    navIdent: z.string(),
    navn: z.string(),
});

export type Eier = z.infer<typeof eierSchema>;

export const periodeSchema = z.object({
    fraDato: datoSchema,
    tilDato: datoSchema,
});

export type Periode = z.infer<typeof periodeSchema>;

const IA_PROSESS_STATUSER = [
    "NY",
    "IKKE_AKTIV",
    "VURDERES",
    "KONTAKTES",
    "KARTLEGGES",
    "VI_BISTÅR",
    "IKKE_AKTUELL",
    "FULLFØRT",
    "SLETTET",
] as const;

export const IAProsessStatusEnum = z.enum(IA_PROSESS_STATUSER);

export type IAProsessStatusType = z.infer<typeof IAProsessStatusEnum>;

const SPØRREUNDERSØKELSE_STATUSER = [
    "OPPRETTET",
    "PÅBEGYNT",
    "AVSLUTTET",
    "SLETTET",
] as const;
export const spørreundersøkelseStatusEnum = z.enum(SPØRREUNDERSØKELSE_STATUSER);
export type SpørreundersøkelseStatus = z.infer<
    typeof spørreundersøkelseStatusEnum
>;

export type VirksomhetSøkeresultat = {
    orgnr: string;
    navn: string;
};

const IA_SAKSHENDELSE_TYPER = [
    "OPPRETT_SAK_FOR_VIRKSOMHET",
    "VIRKSOMHET_VURDERES",
    "TA_EIERSKAP_I_SAK",
    "VIRKSOMHET_SKAL_KONTAKTES",
    "VIRKSOMHET_ER_IKKE_AKTUELL",
    "VIRKSOMHET_KARTLEGGES",
    "VIRKSOMHET_SKAL_BISTÅS",
    "ENDRE_PROSESS",
    "NY_PROSESS",
    "SLETT_PROSESS",
    "FULLFØR_BISTAND",
    "TILBAKE",
    "SLETT_SAK",
] as const;

export const IASakshendelseTypeEnum = z.enum(IA_SAKSHENDELSE_TYPER);

export type IASakshendelseType = z.infer<typeof IASakshendelseTypeEnum>;

const begrunnelseSchema = z.object({
    type: z.string(),
    navn: z.string(),
});

// Er denne brukt nokon stad? 2023-02-02
export type Begrunnelse = z.infer<typeof begrunnelseSchema>;

const årsakSchema = z.object({
    type: z.string(),
    navn: z.string(),
    begrunnelser: z.array(begrunnelseSchema),
});

export type Årsak = z.infer<typeof årsakSchema>;

export type ValgtÅrsakDto = {
    type: string;
    begrunnelser: string[];
};

const gyldigNesteHendelseSchema = z.object({
    saksHendelsestype: IASakshendelseTypeEnum,
    gyldigeÅrsaker: z.array(årsakSchema),
});

export type GyldigNesteHendelse = z.infer<typeof gyldigNesteHendelseSchema>;

export const iaSakSchema = z.object({
    saksnummer: z.string(),
    orgnr: z.string(),
    opprettetTidspunkt: datoSchema,
    opprettetAv: z.string(),
    endretTidspunkt: datoSchema.nullable(),
    endretAv: z.string().nullable(),
    endretAvHendelseId: z.string(),
    eidAv: z.string().nullable(),
    status: IAProsessStatusEnum,
    gyldigeNesteHendelser: z.array(gyldigNesteHendelseSchema),
    lukket: z.boolean(),
});
export type IASak = z.infer<typeof iaSakSchema>;

export const iaSakshendelseSchema = z.object({
    id: z.string(),
    orgnummer: z.string(),
    saksnummer: z.string(),
    hendelsestype: IASakshendelseTypeEnum,
    opprettetAv: z.string(),
    opprettetTidspunkt: datoSchema,
});
export type IASakshendelse = z.infer<typeof iaSakshendelseSchema>;

export interface IANySakshendelseDto {
    orgnummer: string;
    saksnummer: string;
    hendelsesType: string;
    endretAvHendelseId: string;
    payload?: string;
}

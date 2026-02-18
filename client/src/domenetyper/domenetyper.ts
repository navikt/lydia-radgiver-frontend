import { z } from "zod/v4";

export const datoSchema = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

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
    "AKTIV",
    "NY",
    "IKKE_AKTIV",
    "VURDERES",
    "KONTAKTES",
    "KARTLEGGES",
    "VI_BISTÅR",
    "IKKE_AKTUELL",
    "FULLFØRT",
    "SLETTET",
    "AVBRUTT",
    "VURDERT",
    "AVSLUTTET",
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

const DOKUMENT_STATUSER = ["OPPRETTET", "PUBLISERT", "IKKE_PUBLISERT"] as const;
export const DokumentStatusEnum = z.enum(DOKUMENT_STATUSER);

const DOKUMENT_TYPE = [
    "EVALUERING",
    "BEHOVSVURDERING",
    "SAMARBEIDSPLAN",
] as const;
export const DokumentTypeEnum = z.enum(DOKUMENT_TYPE);
export type DokumentType = z.infer<typeof DokumentTypeEnum>;

export const dokumentpubliseringschema = z.object({
    dokumentId: z.string().nullable().optional(),
    referanseId: z.string(),
    opprettetAv: z.string(),
    status: DokumentStatusEnum.optional(),
    dokumentType: DokumentTypeEnum,
    opprettetTidspunkt: datoSchema,
    publisertTidspunkt: datoSchema.nullable().optional(),
});

export type DokumentPubliseringDto = z.infer<typeof dokumentpubliseringschema>;

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
    "AVBRYT_PROSESS",
    "FULLFØR_PROSESS",
    "FULLFØR_PROSESS_MASKINELT_PÅ_EN_FULLFØRT_SAK",
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
    dato?: string;
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

const VirksomhetIATilstandEnum = z.enum([
    "VirksomhetKlarTilVurdering",
    "VirksomhetVurderes",
    "VirksomhetErVurdert",
    "VirksomhetHarAktiveSamarbeid",
    "AlleSamarbeidIVirksomhetErAvsluttet",
]);

const virksomhetTilstandAutomatiskOppdateringSchema = z.object({
    startTilstand: VirksomhetIATilstandEnum,
    planlagtHendelse: z.string(),
    nyTilstand: VirksomhetIATilstandEnum,
    planlagtDato: datoSchema,
});

export const virksomhetTilstandDtoSchema = z.object({
    orgnr: z.string(),
    tilstand: VirksomhetIATilstandEnum,
    nesteTilstand: virksomhetTilstandAutomatiskOppdateringSchema
        .nullable()
        .optional(),
});

export type VirksomhetTilstandDto = z.infer<typeof virksomhetTilstandDtoSchema>;
export type VirksomhetIATilstand = z.infer<typeof VirksomhetIATilstandEnum>;

export const nyFlytBegrunnelseEnum = z.enum([
    "VIRKSOMHETEN_HAR_IKKE_SVART",
    "VIRKSOMHETEN_HAR_TAKKET_NEI",
    "IKKE_DOKUMENTERT_DIALOG_MELLOM_PARTENE",
    "FOR_FÅ_TAPTE_DAGSVERK",
    "INTERN_VURDERING_FØR_KONTAKT",
    "NAV_HAR_IKKE_KAPASITET",
    "VIRKSOMHETEN_ØNSKER_SAMARBEID_SENERE",
]);
export type NyFlytBegrunnelse = z.infer<typeof nyFlytBegrunnelseEnum>;

export const nyFlytÅrsakTypeEnum = z.enum([
    "VIRKSOMHETEN_SKAL_VURDERES_SENERE",
    "VIRKSOMHETEN_ER_FERDIG_VURDERT",
]);
export type NyFlytÅrsakType = z.infer<typeof nyFlytÅrsakTypeEnum>;

export type ValgtÅrsakNyFlytDto = {
    type: NyFlytÅrsakType;
    begrunnelser: NyFlytBegrunnelse[];
    dato?: string;
};

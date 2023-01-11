import { z } from "zod";
import { sorteringsverdier } from "./Pages/Prioritering/Filter/Filtervisning";

export const datoSchema = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date()) as z.ZodEffects<z.ZodDate, Date, Date>;

export const fylkeOgKommuneSchema = z.object({
    nummer: z.string(),
    navn: z.string(),
});

export const fylkeMedKommunerSchema = z.object({
    fylke: fylkeOgKommuneSchema,
    kommuner: z.array(fylkeOgKommuneSchema),
});

export const næringsgrupperSchema = z.object({
    navn: z.string(),
    kode: z.string(),
});

export const eierSchema = z.object({
    navIdent: z.string(),
    navn: z.string(),
});

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

export const sykefraversstatistikkVirksomhetSchema = z.object({
    orgnr: z.string(),
    virksomhetsnavn: z.string(),
    kommune: fylkeOgKommuneSchema,
    sektor: z.string(),
    neringsgruppe: z.string(),
    arstall: z.number(),
    kvartal: z.number(),
    sykefraversprosent: z.number(),
    antallPersoner: z.number(),
    muligeDagsverk: z.number(),
    tapteDagsverk: z.number(),
    status: IAProsessStatusEnum,
    eidAv: z.string().nullable(),
    sistEndret: datoSchema.nullable(),
});

export const sykefraversstatistikkVirksomhetListeSchema = z.array(
    sykefraversstatistikkVirksomhetSchema
);

export const sykefraværListeResponsSchema = z.object({
    data: sykefraversstatistikkVirksomhetListeSchema,
});

export const kvartalSchema = z.object({
    kvartal: z.number(),
    årstall: z.number(),
})

export const kvartalerSchema = z.array(kvartalSchema)

export const sykefraversstatistikkVirksomhetSiste4KvartalSchema = sykefraversstatistikkVirksomhetSchema.extend({
    antallKvartaler: z.number(),
    kvartaler: kvartalerSchema,
})

export const sykefraversstatistikkVirksomhetSiste4KvartalListeSchema = z.array(sykefraversstatistikkVirksomhetSiste4KvartalSchema)

export const sykefraversstatistikkVirksomhetSiste4KvartalListeResponsSchema = z.object({
    data: sykefraversstatistikkVirksomhetSiste4KvartalListeSchema,
});

export const filterverdierSchema = z.object({
    fylker: z.array(fylkeMedKommunerSchema),
    neringsgrupper: z.array(næringsgrupperSchema),
    sorteringsnokler: z.string().array(),
    statuser: IAProsessStatusEnum.array(),
    bransjeprogram: z.string().array(),
    filtrerbareEiere: z.array(eierSchema),
});

export type IAProsessStatusType = z.infer<typeof IAProsessStatusEnum>;

export type FylkeMedKommuner = z.infer<typeof fylkeMedKommunerSchema>;

export type Filterverdier = z.infer<typeof filterverdierSchema>;

export type Næringsgruppe = z.infer<typeof næringsgrupperSchema>;

export type Eier = z.infer<typeof eierSchema>;

export type Kvartal = z.infer<typeof kvartalSchema>;

export type SykefraversstatistikkVirksomhet = z.infer<
    typeof sykefraversstatistikkVirksomhetSchema
>;

export type SykefraværsstatistikkVirksomhetRespons = z.infer<
    typeof sykefraværListeResponsSchema
>;

export type SykefraversstatistikkVirksomhetSiste4Kvartal = z.infer<
    typeof sykefraversstatistikkVirksomhetSiste4KvartalSchema
>;

export type Sorteringsverdi = keyof typeof sorteringsverdier;

const VIRKSOMHET_STATUS = ["AKTIV", "FJERNET", "SLETTET"] as const;
export const VirksomhetStatusEnum = z.enum(VIRKSOMHET_STATUS);
export const virksomhetsSchema = z.object({
    orgnr: z.string(),
    navn: z.string(),
    adresse: z.string().array(),
    postnummer: z.string(),
    poststed: z.string(),
    neringsgrupper: næringsgrupperSchema.array(),
    sektor: z.string().optional(),
    status: VirksomhetStatusEnum,
});
export type Virksomhet = z.infer<typeof virksomhetsSchema>;

export type VirksomhetSøkeresultat = {
    orgnr: string;
    navn: string;
};

const ROLLE = ["Superbruker", "Saksbehandler", "Lesetilgang"] as const;
export const RolleEnum = z.enum(ROLLE);
export const brukerinfoSchema = z.object({
    navn: z.string(),
    ident: z.string(),
    epost: z.string(),
    tokenUtløper: z.number(),
    rolle: RolleEnum,
});
export type Brukerinformasjon = z.infer<typeof brukerinfoSchema>;

export type Fylke = z.infer<typeof fylkeOgKommuneSchema>;
export type Kommune = z.infer<typeof fylkeOgKommuneSchema>;

const IA_SAKSHENDELSE_TYPER = [
    "OPPRETT_SAK_FOR_VIRKSOMHET",
    "VIRKSOMHET_VURDERES",
    "TA_EIERSKAP_I_SAK",
    "VIRKSOMHET_SKAL_KONTAKTES",
    "VIRKSOMHET_ER_IKKE_AKTUELL",
    "VIRKSOMHET_KARTLEGGES",
    "VIRKSOMHET_SKAL_BISTÅS",
    "FULLFØR_BISTAND",
    "TILBAKE",
    "SLETT_SAK",
] as const;

export const IASakshendelseTypeEnum = z.enum(IA_SAKSHENDELSE_TYPER);
export type IASakshendelseType = z.infer<typeof IASakshendelseTypeEnum>;

export const begrunnelseSchema = z.object({
    type: z.string(),
    navn: z.string(),
});

export type Begrunnelse = z.infer<typeof begrunnelseSchema>;

export const årsakSchema = z.object({
    type: z.string(),
    navn: z.string(),
    begrunnelser: z.array(begrunnelseSchema),
});

export type Årsak = z.infer<typeof årsakSchema>;

export type ValgtÅrsakDto = {
    type: string;
    begrunnelser: string[];
};

export const gyldigNesteHendelseSchema = z.object({
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

export const sakSnapshotSchema = z.object({
    status: IAProsessStatusEnum,
    hendelsestype: IASakshendelseTypeEnum,
    tidspunktForSnapshot: datoSchema,
    begrunnelser: z.string().array(),
    eier: z.string().nullable(),
});

export const sakshistorikkSchema = z.object({
    saksnummer: z.string(),
    opprettet: datoSchema,
    sakshendelser: sakSnapshotSchema.array(),
});

export type Sakshistorikk = z.infer<typeof sakshistorikkSchema>;

export interface IANySakshendelseDto {
    orgnummer: string;
    saksnummer: string;
    hendelsesType: string;
    endretAvHendelseId: string;
    payload?: string;
}

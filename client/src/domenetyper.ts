import { z } from "zod";
import { sorteringsverdier } from "./Pages/Prioritering/Filtervisning";
import { Range } from "./Pages/Prioritering/SykefraværsprosentVelger";

export const datoSchema = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const fylkeOgKommuneSchema = z.object({
    nummer: z.string(),
    navn: z.string(),
});

export const fylkerMedKommunerSchema = z.object({
    fylke: fylkeOgKommuneSchema,
    kommuner: z.array(fylkeOgKommuneSchema),
});

export const næringsgrupperSchema = z.object({
    navn: z.string(),
    kode: z.string(),
});

const IA_PROSESS_STATUSER = [
    "IKKE_AKTIV",
    "VURDERES",
    "KONTAKTES",
    "IKKE_AKTUELL"
] as const

export const IAProsessStatusEnum =  z.enum(IA_PROSESS_STATUSER)

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
    eidAv: z.string().nullable()
});

export const sykefraversstatistikkVirksomhetListeSchema = z.array(
    sykefraversstatistikkVirksomhetSchema
);

export const sykefraværListeResponsSchema = z.object({
    data: sykefraversstatistikkVirksomhetListeSchema,
    total: z.number()
})

export const filterverdierSchema = z.object({
    fylker: z.array(fylkerMedKommunerSchema),
    neringsgrupper: z.array(næringsgrupperSchema),
    sorteringsnokler: z.string().array(),
    statuser: IAProsessStatusEnum.array()
});

export type IAProsessStatusType = z.infer<typeof IAProsessStatusEnum>

export type FylkerMedKommuner = z.infer<typeof fylkerMedKommunerSchema>;

export type Filterverdier = z.infer<typeof filterverdierSchema>;

export type Næringsgruppe = z.infer<typeof næringsgrupperSchema>;

export type SykefraversstatistikkVirksomhet = z.infer<
    typeof sykefraversstatistikkVirksomhetSchema
>;

export type SykefraværsstatistikkVirksomhetRespons = z.infer<typeof sykefraværListeResponsSchema>

export type Sorteringsverdi = keyof typeof sorteringsverdier

export interface Søkeverdier {
    kommuner?: Kommune[];
    fylker?: Fylke[];
    neringsgrupper?: Næringsgruppe[];
    sykefraversprosentRange?: Range;
    antallAnsatteRange?: Range;
    sorteringsnokkel?: Sorteringsverdi;
    iaStatus?: IAProsessStatusType
    side?: number
}

export const virksomhetsSchema = z.object({
    orgnr: z.string(),
    navn: z.string(),
    adresse: z.string().array(),
    postnummer: z.string(),
    poststed: z.string(),
    neringsgrupper: næringsgrupperSchema.array(),
    sektor: z.string().optional(),
})

export type Virksomhet = z.infer<typeof virksomhetsSchema>

export const brukerinfoSchema = z.object({
    navn: z.string(),
    ident: z.string(),
    epost: z.string(),
    tokenUtløper: z.number()
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
] as const

export const IASakshendelseTypeEnum = z.enum(IA_SAKSHENDELSE_TYPER)
export type IASakshendelseType = z.infer<typeof IASakshendelseTypeEnum>

const IA_SAKS_TYPER = [
    "NAV_STOTTER",
    "SELVBETJENT"
] as const
export const IASaksType = z.enum(IA_SAKS_TYPER)

export const begrunnelseSchema = z.object({
    type: z.string(),
    navn: z.string(),
})

export type Begrunnelse = z.infer<typeof begrunnelseSchema>

export const årsakSchema = z.object({
    type: z.string(),
    navn: z.string(),
    begrunnelser: z.array(begrunnelseSchema)
})

export type Årsak = z.infer<typeof årsakSchema>

export type ValgtÅrsakDto = {
    type : string,
    begrunnelser : string[]
}

export const gyldigNesteHendelseSchema = z.object({
    saksHendelsestype : IASakshendelseTypeEnum,
    gyldigeÅrsaker : z.array(årsakSchema)
})

export type GyldigNesteHendelse = z.infer<typeof gyldigNesteHendelseSchema>;

export const iaSakSchema = z.object({
    saksnummer: z.string(),
    orgnr: z.string(),
    type: IASaksType,
    opprettetTidspunkt: datoSchema,
    opprettetAv: z.string(),
    endretTidspunkt: datoSchema.nullable(),
    endretAv: z.string().nullable(),
    endretAvHendelseId: z.string(),
    eidAv: z.string().nullable(),
    status: IAProsessStatusEnum,
    gyldigeNesteHendelser: z.array(gyldigNesteHendelseSchema),
})
export type IASak = z.infer<typeof iaSakSchema>;

export const iaSakshendelseSchema = z.object({
    id: z.string(),
    orgnummer: z.string(),
    saksnummer: z.string(),
    hendelsestype : IASakshendelseTypeEnum,
    opprettetAv : z.string(),
    opprettetTidspunkt: datoSchema,
})

export type IASakshendelse = z.infer<typeof iaSakshendelseSchema>

export interface IANySakshendelseDto {
    orgnummer: string;
    saksnummer: string;
    hendelsesType: string;
    endretAvHendelseId: string;
    payload?: string
}

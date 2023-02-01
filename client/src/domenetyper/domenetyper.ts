import { z } from "zod";
import { sorteringsverdier } from "../Pages/Prioritering/Filter/Filtervisning";
import { fylkeMedKommunerSchema } from "./fylkeOgKommuneTyper";
import { næringsgrupperSchema, sektorSchema } from "./virksomhet";

export const datoSchema = z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date()) as z.ZodEffects<z.ZodDate, Date, Date>;

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

export const filterverdierSchema = z.object({
    fylker: z.array(fylkeMedKommunerSchema),
    neringsgrupper: z.array(næringsgrupperSchema),
    sorteringsnokler: z.string().array(),
    statuser: IAProsessStatusEnum.array(),
    bransjeprogram: z.string().array(),
    filtrerbareEiere: z.array(eierSchema),
    sektorer: z.array(sektorSchema)
});

export type IAProsessStatusType = z.infer<typeof IAProsessStatusEnum>;

export type Filterverdier = z.infer<typeof filterverdierSchema>;

export type Eier = z.infer<typeof eierSchema>;

export type Sorteringsverdi = keyof typeof sorteringsverdier;

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

export interface IANySakshendelseDto {
    orgnummer: string;
    saksnummer: string;
    hendelsesType: string;
    endretAvHendelseId: string;
    payload?: string;
}

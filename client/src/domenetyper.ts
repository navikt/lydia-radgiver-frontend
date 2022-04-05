import { z } from "zod";
import { sorteringsverdier } from "./Pages/Prioritering/Filtervisning";
import { Range } from "./Pages/Prioritering/SykefraværsprosentVelger";

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
    "NY",
    "PRIORITERT",
    "TAKKET_NEI",
    "KARTLEGGING",
    "GJENNOMFORING",
    "EVALUERING",
    "AVSLUTTET",
    "IKKE_AKTIV",
    "AVSLATT_AV_NALS"
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
    status: IAProsessStatusEnum
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
    sorteringsnokkel?: Sorteringsverdi;
    iastatus?: IAProsessStatusType
    side?: number
}

export const virksomhetsSchema = z.object({
    orgnr: z.string(),
    navn: z.string(),
    adresse: z.string().array(),
    postnummer: z.string(),
    poststed: z.string(),
    neringsgrupper: næringsgrupperSchema.array(),
})

export type Virksomhet = z.infer<typeof virksomhetsSchema>

export const navAnsattSchema = z.object({
    navn: z.string(),
    ident: z.string(),
    epost: z.string(),
});
export type NavAnsatt = z.infer<typeof navAnsattSchema>;

export type Fylke = z.infer<typeof fylkeOgKommuneSchema>;
export type Kommune = z.infer<typeof fylkeOgKommuneSchema>;

import { lokalDato } from "../../../util/dato";
import { PersonopplysningssjekkResultat } from "../../../api/lydia-api/personopplysningssjekk";
import {
    Samarbeidsmål,
    Mål,
    SYKEFRAVÆRSMÅLTYPER,
    Sykefraværsmål,
    Sykefraværsmåltype,
} from "../../../domenetyper/mål";

export { SYKEFRAVÆRSMÅLTYPER };
export type { Samarbeidsmål, Mål, Sykefraværsmål, Sykefraværsmåltype };

export const MAKS_ANTALL_TEGN_I_MÅL = 250;

export const SYKEFRAVÆRSMÅLTYPE_NAVN: Record<Sykefraværsmåltype, string> = {
    LANGTIDSFRAVÆR: "Langtidsfravær",
    KORTTIDSFRAVÆR: "Korttidsfravær",
    EGENMELDT_FRAVÆR: "Egenmeldt fravær",
    LEGEMELDT_FRAVÆR: "Legemeldt fravær",
    GRADERT_FRAVÆR: "Gradert fravær",
    TAPTE_DAGSVERK: "Tapte dagsverk",
};

export const SYKEFRAVÆRSMÅLTYPE_HJELPETEKST: Record<
    Sykefraværsmåltype,
    string
> = {
    LANGTIDSFRAVÆR: "Fravær som varer over en lengre periode.",
    KORTTIDSFRAVÆR: "Fravær som varer i en kortere periode.",
    EGENMELDT_FRAVÆR:
        "Fravær som den ansatte selv melder fra om uten sykmelding.",
    LEGEMELDT_FRAVÆR:
        "Fravær som er dokumentert med sykmelding fra lege eller annen sykmelder.",
    GRADERT_FRAVÆR:
        "Fravær der den ansatte er delvis i arbeid og delvis sykmeldt.",
    TAPTE_DAGSVERK: "Antall arbeidsdager som går tapt på grunn av sykefravær.",
};

export interface Sykefraværsmålutkast {
    id: string;
    type: Sykefraværsmåltype | "";
    nåværende: string;
    mål: string;
    frist?: Date;
}

export type Skjemafelt = "type" | "nåværende" | "mål" | "frist";
export type Valideringsfeil = Partial<Record<Skjemafelt, string>>;

const ANTALL_ÅR_FREM_FOR_FRIST = 3;

export function fristgrenser(idag = new Date()) {
    return {
        fra: new Date(idag.getFullYear(), idag.getMonth(), idag.getDate()),
        til: new Date(idag.getFullYear() + ANTALL_ÅR_FREM_FOR_FRIST, 11, 31),
    };
}

export const FEILMELDINGER = {
    manglerType: "Velg en sykefraværsmåltype.",
    duplikatType: "Det finnes allerede et mål for denne sykefraværsmåltypen.",
    nåværendeProsent:
        "Oppgi dagens fravær som et tall mellom 0 og 100, med høyst to desimaler.",
    målProsent:
        "Oppgi målet som et tall mellom 0 og 100, med høyst to desimaler.",
    nåværendeDagsverk:
        "Oppgi dagens antall tapte dagsverk som et tall på 0 eller mer, med høyst to desimaler.",
    målDagsverk:
        "Oppgi målet i dagsverk som et tall på 0 eller mer, med høyst to desimaler.",
    frist: `Velg en dato fra og med i dag til og med 31.12.${fristgrenser().til.getFullYear()}, eller skriv datoen som dd.mm.åååå.`,
    tomtSamarbeidsmål: "Skriv et mål for samarbeidet.",
    ulagretNyttSykefraværsmål:
        "Trykk «Lagre» under «Mål for sykefraværet» for å ta med målet, eller tøm feltene.",
    ulagretSamarbeidsmål:
        "Trykk «Lagre» under «Mål for samarbeidet» for å ta med målet, eller tøm feltet.",
    ulagretEndringSamarbeidsmål:
        "Trykk «Lagre» i målkortet for å ta med endringen i målet, eller trykk «Avbryt».",
    ulagretEndringSykefraværsmål:
        "Trykk «Lagre» i målkortet for å ta med endringen i sykefraværsmålet, eller trykk «Avbryt».",
};

export const erTapteDagsverk = (type: Sykefraværsmåltype | "") =>
    type === "TAPTE_DAGSVERK";

export const enhet = (type: Sykefraværsmåltype | "") =>
    erTapteDagsverk(type) ? "dagsverk" : "%";

const GYLDIG_TALL = /^\d+([.,]\d{1,2})?$/;

export function parseMålverdi(
    verdi: string,
    type: Sykefraværsmåltype | "",
): number | null {
    const renset = verdi.trim();
    if (!GYLDIG_TALL.test(renset)) return null;
    const tall = Number(renset.replace(",", "."));
    if (!erTapteDagsverk(type) && tall > 100) return null;
    return tall;
}

const tallformat = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 2,
});

export const formaterMålverdi = (verdi: number, type: Sykefraværsmåltype) =>
    `${tallformat.format(verdi)}${erTapteDagsverk(type) ? " " : "\u00a0"}${enhet(type)}`;

export const tilSkjemaverdi = (verdi: number) =>
    String(verdi).replace(".", ",");

export function tilIsoDato(dato: Date): string {
    const år = dato.getFullYear();
    const måned = String(dato.getMonth() + 1).padStart(2, "0");
    const dag = String(dato.getDate()).padStart(2, "0");
    return `${år}-${måned}-${dag}`;
}

export function fraIsoDato(isoDato: string): Date {
    const [år, måned, dag] = isoDato.split("-").map(Number);
    return new Date(år, måned - 1, dag);
}

export const formaterFrist = (isoDato: string) =>
    lokalDato(fraIsoDato(isoDato));

export const opptatteTyper = (
    liste: SykefraværsmålIListe[],
    unntattId?: string,
): Sykefraværsmåltype[] =>
    liste.filter((r) => r.id !== unntattId).map((r) => r.mål.type);

export const ledigeTyper = (opptatte: Sykefraværsmåltype[]) =>
    SYKEFRAVÆRSMÅLTYPER.filter((m) => !opptatte.includes(m));

export type Valideringsresultat =
    { ok: true; mål: Sykefraværsmål } | { ok: false; feil: Valideringsfeil };

export function validerSykefraværsmål(
    utkast: Sykefraværsmålutkast,
    opptatte: Sykefraværsmåltype[],
): Valideringsresultat {
    const feil: Valideringsfeil = {};
    const dagsverk = erTapteDagsverk(utkast.type);

    if (utkast.type === "") {
        feil.type = FEILMELDINGER.manglerType;
    } else if (opptatte.includes(utkast.type)) {
        feil.type = FEILMELDINGER.duplikatType;
    }

    const nåværende = parseMålverdi(utkast.nåværende, utkast.type);
    if (nåværende === null) {
        feil.nåværende = dagsverk
            ? FEILMELDINGER.nåværendeDagsverk
            : FEILMELDINGER.nåværendeProsent;
    }

    const mål = parseMålverdi(utkast.mål, utkast.type);
    if (mål === null) {
        feil.mål = dagsverk
            ? FEILMELDINGER.målDagsverk
            : FEILMELDINGER.målProsent;
    }

    if (!utkast.frist) {
        feil.frist = FEILMELDINGER.frist;
    }

    if (
        Object.keys(feil).length > 0 ||
        utkast.type === "" ||
        nåværende === null ||
        mål === null ||
        !utkast.frist
    ) {
        return { ok: false, feil };
    }

    return {
        ok: true,
        mål: {
            type: utkast.type,
            nåværende,
            mål,
            frist: tilIsoDato(utkast.frist),
        },
    };
}

let nesteLokaleId = 0;
const lagLokalId = () => `lokalt-mal-${++nesteLokaleId}`;

export const tilUtkast = (mål: Sykefraværsmål): Sykefraværsmålutkast => ({
    id: lagLokalId(),
    type: mål.type,
    nåværende: tilSkjemaverdi(mål.nåværende),
    mål: tilSkjemaverdi(mål.mål),
    frist: fraIsoDato(mål.frist),
});

export interface SykefraværsmålIListe {
    id: string;
    mål: Sykefraværsmål;
}

export const tilSykefraværsmålIListe = (
    mål: Sykefraværsmål,
): SykefraværsmålIListe => ({ id: lagLokalId(), mål });

export const tomtUtkast = (): Sykefraværsmålutkast => ({
    id: lagLokalId(),
    type: "",
    nåværende: "",
    mål: "",
    frist: undefined,
});

export const harInnholdISykefraværsutkast = (utkast: Sykefraværsmålutkast) =>
    utkast.type !== "" ||
    utkast.nåværende.trim() !== "" ||
    utkast.mål.trim() !== "" ||
    utkast.frist !== undefined;

export interface Samarbeidsmålutkast extends Samarbeidsmål {
    nøkkel: string;
    funn?: PersonopplysningssjekkResultat;
}

export const tilSamarbeidsmålutkast = (
    mål: Samarbeidsmål,
): Samarbeidsmålutkast => ({ ...mål, nøkkel: lagLokalId() });

export const tomtSamarbeidsmål = (): Samarbeidsmålutkast => ({
    nøkkel: lagLokalId(),
    mål: "",
    lagretMedKiAdvarsel: false,
});

export type Sjekkutfall =
    | { status: "funn"; resultat: PersonopplysningssjekkResultat }
    | { status: "feilet" };

export const kiAdvarsel = (sjekk?: Sjekkutfall) =>
    sjekk?.status === "funn"
        ? { lagretMedKiAdvarsel: true, funn: sjekk.resultat }
        : { lagretMedKiAdvarsel: false, funn: undefined };

export const tilSamarbeidsmål = ({
    id,
    mål,
    lagretMedKiAdvarsel,
}: Samarbeidsmålutkast): Samarbeidsmål =>
    id == null
        ? { mål, lagretMedKiAdvarsel }
        : { id, mål, lagretMedKiAdvarsel };

const FELT_I_ID: Record<Skjemafelt, string> = {
    type: "type",
    nåværende: "naavaerende",
    mål: "maal",
    frist: "frist",
};

export const skjemaId = (prefiks: string, felt: Skjemafelt) =>
    `${prefiks}-${FELT_I_ID[felt]}`;

export const FELTREKKEFØLGE: Skjemafelt[] = [
    "type",
    "nåværende",
    "mål",
    "frist",
];

export interface Feillenke {
    href: string;
    melding: string;
}

export const tilFeillenker = (
    feil: Valideringsfeil,
    idPrefiks: string,
    kontekst?: string,
): Feillenke[] =>
    FELTREKKEFØLGE.flatMap((felt) => {
        const melding = feil[felt];
        if (!melding) return [];
        return [
            {
                href: `#${skjemaId(idPrefiks, felt)}`,
                melding: kontekst ? `${kontekst}: ${melding}` : melding,
            },
        ];
    });

export const lagIdPrefiks = (reactId: string) =>
    `mal-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

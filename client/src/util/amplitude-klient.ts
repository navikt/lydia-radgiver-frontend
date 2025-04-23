import * as amplitude from "@amplitude/analytics-browser";
import { maskerOrgnr } from "./amplitude-klient-utils";
import { Rolle } from "../domenetyper/brukerinformasjon";
import {
    IAProsessStatusType,
    IASakshendelseType,
} from "../domenetyper/domenetyper";

let initialized = false;

const apiKeys = {
    fiaProd: "747d79b00c945cf3e549ae0b197293bf",
    fiaDev: "747f1d150abf4cad4248ff1d3f93e999",
};

const isProduction = () =>
    typeof window !== "undefined" &&
    window.location.hostname === "fia.ansatt.nav.no";

/**
 *  Gyldige events: https://github.com/navikt/analytics-taxonomy/tree/main/events
 */
type NavsAmplitudeTopologiEventer =
    | "alert vist"
    | "besøk"
    | "accordion lukket"
    | "accordion åpnet"
    | "modal lukket"
    | "modal åpnet"
    | "navigere"
    | "søk"
    | "saksstatus endret"
    | "navigere ut av fia"
    | "endring i valgte linjer i graf"
    | "nullstill filter i søk"
    | "skrudde av eller på autosøk"
    | "fulgte sak"
    | "popover åpnet"
    | "exportert til pdf"
    | "endret tab virksomhetsvisning"
    | "endring i plan";

export const loggSideLastet = (sidetittel: string) => {
    const url = window ? window.location.href : "";
    const maskertUrl = maskerOrgnr(url);
    logAmplitudeEvent("besøk", { url: maskertUrl, sidetittel: sidetittel });
};

const logAmplitudeEvent = (
    eventNavn: NavsAmplitudeTopologiEventer,
    eventData: Record<string, string | boolean | string[]>,
) => {
    if (!initialized) {
        const apiKey = isProduction() ? apiKeys.fiaProd : apiKeys.fiaDev;

        amplitude.init(apiKey, "", {
            defaultTracking: false,
            serverUrl: "https://amplitude.nav.no/collect",
        });
        initialized = true;
    }
    amplitude.track(eventNavn, eventData);
};

export const setTilgangsnivå = (tilgangsnivå: Rolle) => {
    if (!initialized) {
        const apiKey = isProduction() ? apiKeys.fiaProd : apiKeys.fiaDev;

        amplitude.init(apiKey, "", {
            defaultTracking: false,
            serverUrl: "https://amplitude.nav.no/collect",
        });
        initialized = true;
    }
    const identify = new amplitude.Identify();
    identify.set("tilgangsnivå", tilgangsnivå);
    amplitude.identify(identify);
};

export const enum Søkekomponenter {
    PRIORITERING = "prioritering",
    STATUSOVERSIKT = "statusoversikt",
    VIRKSOMHETSSØK = "virksomhetssøk",
    MINESAKER = "minesaker",
}

export const loggSøkPåVirksomhet = (søkstype: "vanlig" | "med *") => {
    // Dataformat basert på forslag om taksonomi på https://github.com/navikt/analytics-taxonomy/tree/main/events/s%C3%B8k
    logAmplitudeEvent("søk", {
        destinasjon: "virksomhet/finn",
        søkeord: søkstype,
        komponent: Søkekomponenter.VIRKSOMHETSSØK,
    });
};

export const enum FilterverdiKategorier {
    FYLKE = "_fylke",
    KOMMUNE = "_kommune",
    STATUS = "_status",
    SEKTOR = "_sektor",
    BRANSJE = "_bransje",
    NÆRINGSGRUPPE = "_næringsgruppe",
    EIER = "_eier",
    SYKEFRAVÆR_FRA = "_sykefravær-fra",
    SYKEFRAVÆR_TIL = "_sykefravær-til",
    ARBEIDSFORHOLD_FRA = "_arbeidsforhold-fra",
    ARBEIDSFORHOLD_TIL = "_arbeidsforhold-til",
    BRANSJE_NÆRING_OVER = "_over-bransje-naring-snitt",
    BRANSJE_NÆRING_UNDER_ELLER_LIK = "_under-eller-lik-bransje-naring-snitt",
}

export const loggFilterverdiKategorier = (
    filterverdiKategorier: FilterverdiKategorier[],
    søkekomponent:
        | Søkekomponenter.PRIORITERING
        | Søkekomponenter.STATUSOVERSIKT,
) => {
    const destinasjon =
        søkekomponent === Søkekomponenter.STATUSOVERSIKT
            ? "statusoversikt"
            : "sykefraversstatistikk";

    logAmplitudeEvent("søk", {
        destinasjon: destinasjon,
        søkeord: filterverdiKategorier,
        komponent: søkekomponent,
    });
};

export const loggTømmingAvFilterverdier = () => {
    logAmplitudeEvent("nullstill filter i søk", {});
};

export const loggTogglingAvAutosøk = (autosøk: boolean) => {
    logAmplitudeEvent("skrudde av eller på autosøk", {
        autosøk: autosøk ? "på" : "av",
    });
};

export const loggSendBrukerTilKartleggingerTab = (
    fraModal: string,
    fane: string,
) => {
    logAmplitudeEvent("navigere", {
        destinasjon: `/virksomhet/[orgnr]/sak/[saksnr]/samarbeid/[samarbeidId]?fane=${fane}`,
        lenketekst: "[samarbeidsnavn]",
        fraModal,
    });
};

export const loggStatusendringPåSak = (
    hendelse: IASakshendelseType,
    fraStatus: IAProsessStatusType,
) => {
    logAmplitudeEvent("saksstatus endret", {
        hendelse: hendelse,
        fraStatus: fraStatus,
        navEnhet: "",
    });
};

export const enum EksternNavigeringKategorier {
    FIA_BRUKERVEILEDNING = "_fia-brukerveiledning",
    IAVEILEDER = "_iaveileder",
    TEAMKATALOGEN = "_teamkatalogen",
    PORTEN = "_porten",
}

export const loggNavigeringMedEksternLenke = (
    destinasjon: EksternNavigeringKategorier,
) => {
    logAmplitudeEvent("navigere ut av fia", {
        destinasjon: destinasjon,
    });
};

export const loggGraflinjeEndringer = (graflinjer: string[]) => {
    logAmplitudeEvent("endring i valgte linjer i graf", {
        graflinjer_array: graflinjer,
    });
};

export const loggFølgeSak = (begyntÅFølge: boolean) => {
    logAmplitudeEvent("fulgte sak", {
        følgehendelse: begyntÅFølge ? "fulgte" : "sluttet å følge",
    });
};

export const loggGåTilSakFraMineSaker = (
    navigertFra: "gå-til-sak-knapp" | "virksomhetslenke",
    url: string,
) => {
    logAmplitudeEvent("navigere", {
        destinasjon: maskerOrgnr(url),
        lenketekst:
            navigertFra == "gå-til-sak-knapp"
                ? "Gå til sak"
                : "Virksomhetsoverskrift",
        navigertFra: "MineSaker",
    });
};

export const enum MineSakerFilterKategorier {
    STATUS = "_status",
    KNYTNING = "_knytning",
    ORGSØK = "_virksomhetsøk",
    ARKIVERTE_SAKER = "_arkiverte-saker",
}

export const loggMineSakerFilter = (typer: MineSakerFilterKategorier[]) => {
    logAmplitudeEvent("søk", {
        destinasjon: Søkekomponenter.MINESAKER,
        søkeord: typer,
        komponent: Søkekomponenter.MINESAKER,
    });
};

export const loggÅpnetVirksomhetsinfo = () => {
    logAmplitudeEvent("popover åpnet", {
        tekst: "Virksomhetsinfo",
        underskrift: "Virksomhetsinfo",
    });
};

export const loggEksportertTilPdf = (
    type: string,
    erForhåndsvisning: boolean = false,
) => {
    logAmplitudeEvent("exportert til pdf", { type, erForhåndsvisning });
};

export const loggNavigertTilNyTab = (tab: string) => {
    logAmplitudeEvent("endret tab virksomhetsvisning", { tab });
};

export const loggModalÅpnet = (tittel: string) => {
    logAmplitudeEvent("modal åpnet", { tittel });
};

export const loggEndringAvPlan = (
    tema: string,
    undertema: string,
    type: "fra" | "til" | "valgt" | "fjernet",
) => {
    logAmplitudeEvent("endring i plan", {
        tema,
        undertema,
        type,
    });
};

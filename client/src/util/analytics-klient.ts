import { maskerOrgnr } from "./analytics-klient-utils";
import { Rolle } from "../domenetyper/brukerinformasjon";
import {
    IAProsessStatusType,
    IASakshendelseType,
} from "../domenetyper/domenetyper";

declare global {
    interface Window {
        umami: {
            track: (eventNavn: string, eventData: Record<string, string | boolean | string[]>) => void;
            identify: (userProperties: Record<string, string>) => void;
        };
    }
}

/**
 *  Gyldige events: https://github.com/navikt/analytics-taxonomy/tree/main/events
 */
type NavsAnalyticsTopologiEventer =
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
    logAnalyticsEvent("besøk", { url: maskertUrl, sidetittel: sidetittel });
};

const logAnalyticsEvent = (
    eventNavn: NavsAnalyticsTopologiEventer,
    eventData: Record<string, string | boolean | string[]>,
) => {
    const umami = window.umami;

    if (umami) {
        umami.track(eventNavn, eventData);
    } else {
        console.warn("Umami er ikke tilgjengelig for å logge event:", eventNavn);
    }
};


export const setTilgangsnivå = (tilgangsnivå: Rolle) => {
    const umami = window.umami;
    if (umami) {
        umami.identify({ tilgangsnivå });
    } else {
        console.warn("Umami er ikke tilgjengelig for å sette tilgangsnivå");
    }
};

export const enum Søkekomponenter {
    PRIORITERING = "prioritering",
    STATUSOVERSIKT = "statusoversikt",
    VIRKSOMHETSSØK = "virksomhetssøk",
    MINESAKER = "minesaker",
}

export const loggSøkPåVirksomhet = (søkstype: "vanlig" | "med *") => {
    // Dataformat basert på forslag om taksonomi på https://github.com/navikt/analytics-taxonomy/tree/main/events/s%C3%B8k
    logAnalyticsEvent("søk", {
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

    logAnalyticsEvent("søk", {
        destinasjon: destinasjon,
        søkeord: filterverdiKategorier,
        komponent: søkekomponent,
    });
};

export const loggTømmingAvFilterverdier = () => {
    logAnalyticsEvent("nullstill filter i søk", {});
};

export const loggTogglingAvAutosøk = (autosøk: boolean) => {
    logAnalyticsEvent("skrudde av eller på autosøk", {
        autosøk: autosøk ? "på" : "av",
    });
};

export const loggSendBrukerTilKartleggingerTab = (
    fraModal: string,
    fane: string,
) => {
    logAnalyticsEvent("navigere", {
        destinasjon: `/virksomhet/[orgnr]/sak/[saksnr]/samarbeid/[samarbeidId]?fane=${fane}`,
        lenketekst: "[samarbeidsnavn]",
        fraModal,
    });
};

export const loggStatusendringPåSak = (
    hendelse: IASakshendelseType,
    fraStatus: IAProsessStatusType,
) => {
    logAnalyticsEvent("saksstatus endret", {
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
    logAnalyticsEvent("navigere ut av fia", {
        destinasjon: destinasjon,
    });
};

export const loggGraflinjeEndringer = (graflinjer: string[]) => {
    logAnalyticsEvent("endring i valgte linjer i graf", {
        graflinjer_array: graflinjer,
    });
};

export const loggFølgeSak = (begyntÅFølge: boolean) => {
    logAnalyticsEvent("fulgte sak", {
        følgehendelse: begyntÅFølge ? "fulgte" : "sluttet å følge",
    });
};

export const loggGåTilSakFraMineSaker = (
    navigertFra: "gå-til-sak-knapp" | "virksomhetslenke",
    url: string,
) => {
    logAnalyticsEvent("navigere", {
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
    logAnalyticsEvent("søk", {
        destinasjon: Søkekomponenter.MINESAKER,
        søkeord: typer,
        komponent: Søkekomponenter.MINESAKER,
    });
};

export const loggÅpnetVirksomhetsinfo = () => {
    logAnalyticsEvent("popover åpnet", {
        tekst: "Virksomhetsinfo",
        underskrift: "Virksomhetsinfo",
    });
};

export const loggEksportertTilPdf = (
    type: string,
    erForhåndsvisning: boolean = false,
) => {
    logAnalyticsEvent("exportert til pdf", { type, erForhåndsvisning });
};

export const loggNavigertTilNyTab = (tab: string) => {
    logAnalyticsEvent("endret tab virksomhetsvisning", { tab });
};

export const loggModalÅpnet = (tittel: string) => {
    logAnalyticsEvent("modal åpnet", { tittel });
};

export const loggEndringAvPlan = (
    tema: string,
    undertema: string,
    type: "fra" | "til" | "valgt" | "fjernet",
) => {
    logAnalyticsEvent("endring i plan", {
        tema,
        undertema,
        type,
    });
};

export const loggBrukerRedirigertMedSøkAlert = () => {
    logAnalyticsEvent("alert vist", {
        tekst: "Vi har flyttet prioriteringssiden, så lenker og bokmerker med lagrede søk fungerer kanskje ikke lenger."
    });
};

export const loggBrukerFulgteRedirectlenkeMedSøk = () => {
    logAnalyticsEvent("navigere", {
        destinasjon: "/prioritering",
        lenketekst: "Denne lenken",
        komponent: "redirect alert"
    });
}
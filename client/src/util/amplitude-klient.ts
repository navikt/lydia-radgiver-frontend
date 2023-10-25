import amplitude, { AmplitudeClient } from "amplitude-js";
import { maskerOrgnr } from "./amplitude-klient-utils";
import { Rolle } from "../domenetyper/brukerinformasjon";
import { IAProsessStatusType, IASakshendelseType } from "../domenetyper/domenetyper";

const amplitudeKlient: AmplitudeClient = amplitude.getInstance();

let initialized = false;

const apiKeys = {
    fiaProd: "747d79b00c945cf3e549ae0b197293bf",
    fiaDev: "747f1d150abf4cad4248ff1d3f93e999"
};

const isProduction = () =>
    typeof window !== "undefined" &&
    window.location.hostname === "fia.intern.nav.no";

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

export const loggSideLastet = (sidetittel: string) => {
    const url = window ? window.location.href : "";
    const maskertUrl = maskerOrgnr(url);
    logAmplitudeEvent("besøk", { url: maskertUrl, sidetittel: sidetittel })
};

const logAmplitudeEvent = (
    eventNavn: NavsAmplitudeTopologiEventer,
    eventData: Record<string, string | boolean | string[]>
) => {
    if (!initialized) {
        const apiKey = isProduction()
            ? apiKeys.fiaProd
            : apiKeys.fiaDev;

        amplitudeKlient.init(apiKey, "", {
            apiEndpoint: "amplitude.nav.no/collect"
        });
        initialized = true;
    }
    amplitudeKlient.logEvent(eventNavn, eventData);
};

export const setTilgangsnivå = (tilgangsnivå: Rolle) => {
    if (!initialized) {
        const apiKey = isProduction()
            ? apiKeys.fiaProd
            : apiKeys.fiaDev;

        amplitudeKlient.init(apiKey, "", {
            apiEndpoint: "amplitude.nav.no/collect"
        });
        initialized = true;
    }
    amplitudeKlient.setUserProperties({ "tilgangsnivå": tilgangsnivå });
};

export const enum Søkekomponenter {
    PRIORITERING = "prioritering",
    STATUSOVERSIKT = "statusoversikt",
    VIRKSOMHETSSØK = "virksomhetssøk"
}

export const loggSøkPåVirksomhet = (
    søkstype: "vanlig" | "med *",
) => {
    // Dataformat basert på forslag om taksonomi på https://github.com/navikt/analytics-taxonomy/tree/main/events/s%C3%B8k
    logAmplitudeEvent("søk", {
        destinasjon: "virksomhet/finn",
        søkeord: søkstype,
        komponent: Søkekomponenter.VIRKSOMHETSSØK,
    })

}

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
    BRANSJE_NÆRING_UNDER_ELLER_LIK = "_under-eller-lik-bransje-naring-snitt"
}

type FiltersøkDestinasjoner =
    | "sykefraversstatistikk"
    | "statusoversikt"

export const loggFilterverdiKategorier = (
    filterverdiKategorier: FilterverdiKategorier,
    destinasjon: FiltersøkDestinasjoner,
    søkekomponent: Søkekomponenter,
) => {
    logAmplitudeEvent("søk", {
        destinasjon: destinasjon,
        søkeord: filterverdiKategorier,
        komponent: søkekomponent,
    });
}

export const loggModalTilbakeTilForrigeStatusLukket = (
    modalTittel: string,
    modalUnderskrift: string,
    valg: 'ja' | 'avbryt',
    fraStatus: string,
) => {
    logAmplitudeEvent("modal lukket", {
        tekst: modalTittel,
        underskrift: modalUnderskrift,
        valg: valg,
        fraStatus: fraStatus,
    });
}

export const loggStatusendringPåSak = (
    hendelse: IASakshendelseType,
    fraStatus: IAProsessStatusType,
) => {
    logAmplitudeEvent("saksstatus endret", {
        hendelse: hendelse,
        fraStatus: fraStatus,
        navEnhet: "",
    });
}

export const enum EksternNavigeringKategorier {
    FIA_BRUKERVEILEDNING = "_fia-brukerveiledning",
    IAVEILEDER = "_iaveileder",
    TEAMKATALOGEN = "_teamkatalogen",
}

export const loggNavigeringMedEksternLenke = (
    destinasjon: EksternNavigeringKategorier,
) => {
    logAmplitudeEvent("navigere ut av fia", {
        destinasjon: destinasjon,
    });
}

export const loggGraflinjeEndringer = (
    graflinjer: string[],
) => {
    logAmplitudeEvent("endring i valgte linjer i graf", {
        graflinjer_array: graflinjer,
    });
}

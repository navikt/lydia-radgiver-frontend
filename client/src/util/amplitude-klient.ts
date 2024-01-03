import * as amplitude from "@amplitude/analytics-browser";
import { maskerOrgnr } from "./amplitude-klient-utils";
import { Rolle } from "../domenetyper/brukerinformasjon";
import { IAProsessStatusType, IASakshendelseType } from "../domenetyper/domenetyper";
import { erSammeDato } from "./dato";
import { tallTilFemmerintervall } from "./tallTilFemmerintervall";

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
    | "nullstill filter i søk"
    | "opprette leveranse med frist"
    | "aktivitet på IA-tjenesteoversikt"
    | "skrudde av eller på autosøk";

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

        amplitude.init(apiKey, "", {
            defaultTracking: false,
            serverUrl: "https://amplitude.nav.no/collect"
        });
        initialized = true;
    }
    amplitude.track(eventNavn, eventData);
};

export const setTilgangsnivå = (tilgangsnivå: Rolle) => {
    if (!initialized) {
        const apiKey = isProduction()
            ? apiKeys.fiaProd
            : apiKeys.fiaDev;

        amplitude.init(apiKey, "", {
            defaultTracking: false,
            serverUrl: "https://amplitude.nav.no/collect"
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

export const loggFilterverdiKategorier = (
    filterverdiKategorier: FilterverdiKategorier[],
    søkekomponent: Søkekomponenter.PRIORITERING | Søkekomponenter.STATUSOVERSIKT,
) => {
    const destinasjon = søkekomponent === Søkekomponenter.STATUSOVERSIKT
        ? "statusoversikt"
        : "sykefraversstatistikk"

    logAmplitudeEvent("søk", {
        destinasjon: destinasjon,
        søkeord: filterverdiKategorier,
        komponent: søkekomponent,
    });
}

export const loggTømmingAvFilterverdier = () => {
    logAmplitudeEvent("nullstill filter i søk", {})
}

export const loggTogglingAvAutosøk = (autosøk: boolean) => {
    logAmplitudeEvent("skrudde av eller på autosøk", {autosøk: autosøk ? "på" : "av"});
}

export const loggSendBrukerTilAITjenesterTab = (fraModal: string) => {
    logAmplitudeEvent("navigere", {
        destinasjon: "/virksomhet/[orgnr]?fane=ia-tjenester",
        lenketekst: "Ta meg til IA-tjenester",
        fraModal,
    });
}

export const loggAktvitetPåIATjenesteoversikt = () => {
    logAmplitudeEvent("aktivitet på IA-tjenesteoversikt", {
        aktivitetstype: "navigere", // navigere, utføre hendelse (knapper), filtrere/sortere, ...
        beskrivelse: "følg virksomhetslenke til ia-tjenestefane", // detaljerte kategorier
        destinasjon: "/virksomhet/[orgnr]?fane=ia-tjenester", // url for navigering, kanskje api-kall for hendelser/sortering?
        //antallTreff: antallTreff, // antall resultat som vises, for eksempel ved sidelasting eller filtrering/sortering
    })
}

export const loggAntallIATjenesterPåIATjenesteoversikt = (
    antallIATjenester: number
) => {
    logAmplitudeEvent("aktivitet på IA-tjenesteoversikt", {
        aktivitetstype: "se", // navigere, utføre hendelse (knapper), filtrere/sortere, ...
        beskrivelse: "antall IA-tjenester brukeren ser i oversikten sin", // detaljerte kategorier
        //destinasjon: "", // url for navigering, kanskje api-kall for hendelser/sortering?
        antallTreff: tallTilFemmerintervall(antallIATjenester), // antall resultat som vises, for eksempel ved sidelasting eller filtrering/sortering
    })
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

type Tidskategorier = "fortid" | "fremtid" | "i dag";

export const loggLeveranseFristKategori = (
    frist: Date,
) => {
    const finnTidskategoriForDato = (frist: Date): Tidskategorier => {
        const iDag = new Date()

        if (erSammeDato(frist, iDag)) {
            return "i dag";
        } else if (frist < iDag) {
            return "fortid";
        } else {
            return "fremtid";
        }
    }

    const fristkategori = finnTidskategoriForDato(frist)

    logAmplitudeEvent("opprette leveranse med frist", {
        fristKategori: fristkategori,
    });
}

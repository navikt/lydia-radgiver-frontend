import amplitude, { AmplitudeClient } from "amplitude-js";
import { maskerOrgnr } from "./amplitude-klient-utils";
import { Fylke } from "../domenetyper/fylkeOgKommune";
import { Rolle } from "../domenetyper/brukerinformasjon";
import {IAProsessStatusType, IASakshendelseType} from "../domenetyper/domenetyper";

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

export const loggSideLastet = (sidetittel: string) => {
    const url = window ? window.location.href : "";
    const maskertUrl = maskerOrgnr(url);
    logAmplitudeEvent("besøk", { url: maskertUrl, sidetittel: sidetittel })
};

const logAmplitudeEvent = (
    eventNavn: NavsAmplitudeTopologiEventer,
    eventData: Record<string, string | boolean>
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

export const setTilgangsnivå = (tilgangsnivå : Rolle) => {
    if (!initialized) {
        const apiKey = isProduction()
            ? apiKeys.fiaProd
            : apiKeys.fiaDev;

        amplitudeKlient.init(apiKey, "", {
            apiEndpoint: "amplitude.nav.no/collect"
        });
        initialized = true;
    }
    amplitudeKlient.setUserProperties({"tilgangsnivå" : tilgangsnivå});
};

type SøkPåFylkeDestinasjoner =
    | "sykefraversstatistikk?fylker"
    | "sykefraversstatistikk?kommuner"
    | "statusoversikt?fylker"
    | "statusoversikt?kommuner"

type SøkPåFylkeKomponenter =
    | "prioritering"
    | "statusoversikt"
    | "virksomhetssøk"

export const loggSøkPåFylke = (
    fylke: Fylke,
    destinasjon: SøkPåFylkeDestinasjoner,
    komponent: SøkPåFylkeKomponenter,
) => {
    // Dataformat basert på forslag om taksonomi på https://github.com/navikt/analytics-taxonomy/tree/main/events/s%C3%B8k
    logAmplitudeEvent("søk", {
        destinasjon: destinasjon,
        søkeord: fylke.navn,
        komponent: komponent,
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

import amplitude, { AmplitudeClient } from "amplitude-js";
import { maskerOrgnr } from "./amplitude-klient-utils";

const amplitudeKlient : AmplitudeClient = amplitude.getInstance();

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
type validEventNames =
    | 'besøk'
    | 'navigere'
    | 'alert vist'
    | 'accordion åpnet'
    | 'accordion lukket'
    | 'knapp klikket'
    | 'modal åpnet'
    | 'modal lukket'

export const loggSideLastet = (sidetittel: string) => {
    const url = window? window.location.href : '';
    const maskertUrl = maskerOrgnr(url);
    logAmplitudeEvent('besøk', {url: maskertUrl, sidetittel: sidetittel})
};

const logAmplitudeEvent = (eventName: validEventNames, eventData: Record<string, string | boolean>) => {
    if (!initialized) {
        const apiKey = isProduction()
            ? apiKeys.fiaProd
            : apiKeys.fiaDev;

        amplitudeKlient.init(apiKey, "",{
            apiEndpoint: "amplitude.nav.no/collect"
        });
        initialized = true;
    }
    amplitudeKlient.logEvent(eventName, eventData);
};

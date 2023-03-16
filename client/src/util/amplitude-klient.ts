import amplitude, { AmplitudeClient } from "amplitude-js";

const amplitudeKlient : AmplitudeClient = amplitude.getInstance();

let initialized = false;

const apiKeys = {
    fiaProd: "747d79b00c945cf3e549ae0b197293bf",
    fiaDev: "747f1d150abf4cad4248ff1d3f93e999"
};
export const loggSideLastet = (side: string) => {
    if (!initialized) {
        const apiKey = process.env.NAIS_CLUSTER_NAME === "prod-gcp"
            ? apiKeys.fiaProd
            : apiKeys.fiaDev;

        amplitudeKlient.init(apiKey, "",{
            apiEndpoint: "amplitude.nav.no/collect"
        });
        initialized = true;
    }
    amplitudeKlient.logEvent("side-lastet",{side : side} );
};

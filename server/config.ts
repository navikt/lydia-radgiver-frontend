export class Config {
    azure: Azure
    server: Server
    lydiaApi: LydiaApi

    constructor(
        azure = new Azure(),
        server = new Server(),
        lydiaApi = new LydiaApi()
    ) {
        this.azure = azure
        this.server = server
        this.lydiaApi = lydiaApi
    }
}

export const envVars = {
    azureAppClientId: "AZURE_APP_CLIENT_ID",
    azureOpenidConfigTokenEndpoint: "AZURE_OPENID_CONFIG_TOKEN_ENDPOINT",
    azureAppClientSecret: "AZURE_APP_CLIENT_SECRET",
    serverPort: "SERVER_PORT",
    lydiaApiUri: "LYDIA_API_URI",
    clusterName: "NAIS_CLUSTER_NAME",
    nameSpace: "NAIS_NAMESPACE"
}

export class Azure {
    clientId: string;
    tokenEndpoint: string;
    clientSecret: string;

    constructor(
        clientId: string = getEnvVar(envVars.azureAppClientId),
        tokenEndpoint: string = getEnvVar(envVars.azureOpenidConfigTokenEndpoint),
        clientSecret: string = getEnvVar(envVars.azureAppClientSecret)
    ) {
        this.clientId = clientId;
        this.tokenEndpoint = tokenEndpoint;
        this.clientSecret = clientSecret;
    }
}

export class Server {
    port: number
    constructor(port = 8080) {
        const specifiedPort = getOptionalEnvVar(envVars.serverPort)
        this.port = specifiedPort ? parseInt(specifiedPort) : port
    }
}

export class LydiaApi {
    uri: string;
    scope: string;

    constructor(
        uri = getEnvVar(envVars.lydiaApiUri),
    ) {
        this.uri = uri
        this.scope = `api://${getEnvVar(envVars.clusterName)}.${getEnvVar(envVars.nameSpace)}.lydia-api/.default`
    }
}

const ifEnvVarExists = (variabelNavn: string) => exists(getOptionalEnvVar(variabelNavn)) ?
    Promise.resolve(getOptionalEnvVar(variabelNavn)) :
    Promise.reject(`Miljøvariabelen ${variabelNavn} finnes ikke`);

const ifTheseEnvVarExists = (variabelNavn: string[]) => allExists(variabelNavn.map(navn => getOptionalEnvVar(navn))) ?
    Promise.resolve(variabelNavn.map(navn => getOptionalEnvVar(navn))) :
    Promise.reject(`Enkelte av variablene ${variabelNavn} finnes ikke`);

const getEnvVar = (name: string) => {
    if (!process.env[name]) throw new Error(`Missing required variable ${name}`);
    return process.env[name];
}
const getOptionalEnvVar = (name: string) => process.env[name]

const exists = (value: any) => value != null;
const allExists = (values: any[]) => values.every(value => exists(value))
const ifExists = (value: any) => exists(value) ?
    Promise.resolve(value) :
    Promise.reject(`Invalid value: ${value}`);

const ifAllExists = (values: any[]) => allExists(values) ?
    Promise.resolve(values) :
    Promise.reject(`Invalid values: ${values}`);

import {JWKSetRetriever} from "./jwks";


interface ConfigOptions {
    azure?: Azure
    server?: Server
    lydiaApi?: LydiaApi
    jwkSet?: JWKSetRetriever
}

export class Config {
    azure: Azure
    server: Server
    lydiaApi: LydiaApi
    _jwkSet: JWKSetRetriever

    constructor(
        {
            azure = new Azure(),
            server = new Server(),
            lydiaApi = new LydiaApi(),
            jwkSet
        }: ConfigOptions = {}
    ) {
        this.azure = azure
        this.server = server
        this.lydiaApi = lydiaApi
        this._jwkSet = jwkSet
    }
}

export const envVars = {
    azureAppClientId: "AZURE_APP_CLIENT_ID",
    azureOpenidConfigTokenEndpoint: "AZURE_OPENID_CONFIG_TOKEN_ENDPOINT",
    azureAppClientSecret: "AZURE_APP_CLIENT_SECRET",
    azureOpenidConfigIssuer : "AZURE_OPENID_CONFIG_ISSUER",
    serverPort: "SERVER_PORT",
    lydiaApiUri: "LYDIA_API_URI",
    clusterName: "NAIS_CLUSTER_NAME",
    nameSpace: "NAIS_NAMESPACE",
    jwkUri: "AZURE_OPENID_CONFIG_JWKS_URI"
}

export class Azure {
    clientId: string;
    tokenEndpoint: string;
    clientSecret: string;
    issuer: string;
    jwkUri: string

    constructor(
        clientId: string = getEnvVar(envVars.azureAppClientId),
        tokenEndpoint: string = getEnvVar(envVars.azureOpenidConfigTokenEndpoint),
        clientSecret: string = getEnvVar(envVars.azureAppClientSecret),
        issuer: string = getEnvVar(envVars.azureOpenidConfigIssuer),
        jwkUri: string = getEnvVar(envVars.jwkUri)
    ) {
        this.clientId = clientId;
        this.tokenEndpoint = tokenEndpoint;
        this.clientSecret = clientSecret;
        this.issuer = issuer;
        this.jwkUri = jwkUri
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

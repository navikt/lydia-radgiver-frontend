import {JWKSetRetriever} from "./jwks";

interface ConfigOptions {
    azure?: Azure
    server?: Server
    lydiaApi?: LydiaApi
    jwkSet?: JWKSetRetriever
    secrets?: Secrets
}

export class Config {
    azure: Azure;
    server: Server;
    lydiaApi: LydiaApi;
    _jwkSet: JWKSetRetriever;
    secrets: Secrets;

    constructor(
        {
            azure = new Azure(),
            server = new Server(),
            lydiaApi = new LydiaApi(),
            jwkSet,
            secrets = new Secrets(),
        }: ConfigOptions = {}
    ) {
        this.azure = azure
        this.server = server
        this.lydiaApi = lydiaApi
        this._jwkSet = jwkSet
        this.secrets = secrets;
    }
}

export const miljøVariabler = {
    azureAppClientId: "AZURE_APP_CLIENT_ID",
    azureOpenidConfigTokenEndpoint: "AZURE_OPENID_CONFIG_TOKEN_ENDPOINT",
    azureAppClientSecret: "AZURE_APP_CLIENT_SECRET",
    azureOpenidConfigIssuer : "AZURE_OPENID_CONFIG_ISSUER",
    serverPort: "SERVER_PORT",
    lydiaApiUri: "LYDIA_API_URI",
    clusterName: "NAIS_CLUSTER_NAME",
    nameSpace: "NAIS_NAMESPACE",
    jwkUri: "AZURE_OPENID_CONFIG_JWKS_URI",
    fiaSuperbrukerGroupId: "FIA_SUPERBRUKER_GROUP_ID",
    fiaSaksbehandlerGroupId: "FIA_SAKSBEHANDLER_GROUP_ID",
    fiaLesetilgangGroupId: "FIA_LESETILGANG_GROUP_ID",
    sessionHemmelighet: "SESSION_SECRET",
    csrfHemmelighet: "CSRF_SECRET",
    cookieHemmelighet: "COOKIE_SECRET",
}

export class Azure {
    clientId: string;
    tokenEndpoint: string;
    clientSecret: string;
    issuer: string;
    jwkUri: string

    constructor(
        clientId: string = getEnvVar(miljøVariabler.azureAppClientId),
        tokenEndpoint: string = getEnvVar(miljøVariabler.azureOpenidConfigTokenEndpoint),
        clientSecret: string = getEnvVar(miljøVariabler.azureAppClientSecret),
        issuer: string = getEnvVar(miljøVariabler.azureOpenidConfigIssuer),
        jwkUri: string = getEnvVar(miljøVariabler.jwkUri)
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
        const specifiedPort = getOptionalEnvVar(miljøVariabler.serverPort)
        this.port = specifiedPort ? parseInt(specifiedPort) : port
    }
}

export class LydiaApi {
    uri: string;
    scope: string;

    constructor(
        uri = getEnvVar(miljøVariabler.lydiaApiUri),
    ) {
        this.uri = uri
        this.scope = `api://${getEnvVar(miljøVariabler.clusterName)}.${getEnvVar(miljøVariabler.nameSpace)}.lydia-api/.default`
    }
}

export class Secrets {
    csrf: string;
    cookie: string;

    constructor(
        csrf = getEnvVar(miljøVariabler.csrfHemmelighet),
        cookie = getEnvVar(miljøVariabler.cookieHemmelighet)
    ) {
        this.csrf = csrf;
        this.cookie = cookie;
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

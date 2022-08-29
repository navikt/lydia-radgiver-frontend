import {JWKSetRetriever} from "./jwks";


interface ConfigOptions {
    azureConfig?: AzureConfig
    serverConfig?: ServerConfig
    lydiaApiConfig?: LydiaApiConfig
    jwkSet?: JWKSetRetriever
}

export class Config {
    azureConfig: AzureConfig
    serverConfig: ServerConfig
    lydiaApiConfig: LydiaApiConfig
    _jwkSet: JWKSetRetriever

    constructor(
        {
            azureConfig = new AzureConfig(),
            serverConfig = new ServerConfig(),
            lydiaApiConfig = new LydiaApiConfig(),
            jwkSet
        }: ConfigOptions = {}
    ) {
        this.azureConfig = azureConfig
        this.serverConfig = serverConfig
        this.lydiaApiConfig = lydiaApiConfig
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

export class AzureConfig {
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

export class ServerConfig {
    port: number
    constructor(port = 8080) {
        const specifiedPort = getOptionalEnvVar(envVars.serverPort)
        this.port = specifiedPort ? parseInt(specifiedPort) : port
    }
}

export class LydiaApiConfig {
    uri: string;
    scope: string;

    constructor(
        uri = getEnvVar(envVars.lydiaApiUri),
    ) {
        this.uri = uri
        this.scope = `api://${getEnvVar(envVars.clusterName)}.${getEnvVar(envVars.nameSpace)}.lydia-api/.default`
    }
}

const getEnvVar = (name: string) => {
    if (!process.env[name]) throw new Error(`Missing required variable ${name}`);
    return process.env[name];
}
const getOptionalEnvVar = (name: string) => process.env[name]

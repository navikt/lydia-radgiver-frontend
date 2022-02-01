export class Config {
    runtimeEnvironment : NaisEnvironment | LocalEnvironment
    azure : Azure
    server : Server
    isNais : boolean
    isLocal : boolean
    constructor(
        runtimeEnvironment : NaisEnvironment | LocalEnvironment = new NaisEnvironment(),
        azure = new Azure(), 
        server = new Server()
    ) {
        this.runtimeEnvironment = runtimeEnvironment
        this.azure = azure
        this.server = server

        this.isNais = this.runtimeEnvironment instanceof NaisEnvironment;
        this.isLocal = this.runtimeEnvironment instanceof LocalEnvironment;
    }
}

export class NaisEnvironment {
    cluster : string;
    namespace : string
    constructor() {
        this.cluster = getEnvVar("NAIS_CLUSTER_NAME");
        this.namespace = getEnvVar("NAIS_NAMESPACE");        
    }
    isProd = () => this.cluster.startsWith("prod");
    isDev = () => this.cluster.startsWith("dev");

    isNais: () => true;
}

export class LocalEnvironment {
    isNais: () => false;
}

export class Azure {
    clientId : string;
    tokenEndpoint : string;
    clientSecret : string;
    constructor(
        clientId : string = getEnvVar("AZURE_APP_CLIENT_ID"),
        tokenEndpoint : string = getEnvVar("AZURE_OPENID_CONFIG_TOKEN_ENDPOINT"),
        clientSecret : string = getEnvVar("AZURE_APP_CLIENT_SECRET")
    ) {
        this.clientId = clientId;
        this.tokenEndpoint = tokenEndpoint;
        this.clientSecret = clientSecret;
    }
}

class Server {
    port : number
    constructor(port : number = 8080) {
        ifEnvVarExists("PORT")
            .then(port => this.port = parseInt(port))
            .catch(() => this.port = port)
    }
}

const ifEnvVarExists = (variabelNavn : string) => exists(getOptionalEnvVar(variabelNavn)) ?
    Promise.resolve(getOptionalEnvVar(variabelNavn)) :
    Promise.reject(`Miljøvariabelen ${variabelNavn} finnes ikke`);

const ifTheseEnvVarExists = (variabelNavn : string[]) => allExists(variabelNavn.map(navn => getOptionalEnvVar(navn))) ?
    Promise.resolve(variabelNavn.map(navn => getOptionalEnvVar(navn))) :
    Promise.reject(`Enkelte av variablene ${variabelNavn} finnes ikke`);

const getEnvVar = (name : string) => {
    if (!process.env[name]) throw new Error(`Missing required variable ${name}`);
    return process.env[name];
}
const getOptionalEnvVar = (name : string) => process.env[name]

const exists = (value: any) => value != null;
const allExists = (values: any[]) => values.every(value => exists(value))
const ifExists = (value: any) => exists(value) ?
    Promise.resolve(value) :
    Promise.reject(`Invalid value: ${ value }`);

const ifAllExists = (values: any[]) => allExists(values) ?
    Promise.resolve(values) :
    Promise.reject(`Invalid values: ${ values }`);

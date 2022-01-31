export class Config {
    env : NaisEnvironment | LocalEnvironment
    auth : Authentication
    constructor() {
        ifTheseEnvVarExists(["NAIS_CLUSTER_NAME", "NAIS_NAMESPACE"])
            .then(([cluster, namespace]) => this.env = new NaisEnvironment(cluster, namespace))
            .catch(() => this.env = new LocalEnvironment());
    }   
    isNais = () => this.env instanceof NaisEnvironment;
    isLocal = () => this.env instanceof LocalEnvironment;
}

class NaisEnvironment {
    cluster : NaisCluster;
    namespace : string
    constructor(cluster : string, namespace : string) {
        this.cluster = NaisCluster[cluster];
        this.namespace = namespace;        
    }

    isProd = () => this.cluster === NaisCluster.PROD;
    isDev = () => this.cluster === NaisCluster.DEV;
}

class LocalEnvironment {}

enum NaisCluster {
    PROD = "prod-gcp",
    DEV = "dev-gcp",
}


class Authentication {

}

const ifEnvVarExists = (variabelNavn : string) => exists(getEnvVar(variabelNavn)) ?
    Promise.resolve(getEnvVar(variabelNavn)) :
    Promise.reject(`Miljøvariabelen ${variabelNavn} finnes ikke`);

const ifTheseEnvVarExists = (variabelNavn : string[]) => allExists(variabelNavn.map(navn => getEnvVar(navn))) ?
    Promise.resolve(variabelNavn.map(navn => getEnvVar(navn))) :
    Promise.reject(`Enkelte av variablene ${variabelNavn} finnes ikke`);

const getEnvVar = (name : string) => process.env[name]

const exists = (value: any) => value != null;
const allExists = (values: any[]) => values.every(value => exists(value))
const ifExists = (value: any) => exists(value) ?
    Promise.resolve(value) :
    Promise.reject(`Invalid value: ${ value }`);

const ifAllExists = (values: any[]) => allExists(values) ?
    Promise.resolve(values) :
    Promise.reject(`Invalid values: ${ values }`);

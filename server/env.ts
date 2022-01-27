export enum NaisEnvironment {
    PROD = "prod-gcp",
    DEV = "dev-gcp",
    LOCAL = "local",
}

export const naisCluster = process.env.NAIS_CLUSTER_NAME
export const naisNamespace = process.env.NAIS_NAMESPACE
export const isProd = naisCluster === NaisEnvironment.PROD
export const isDev = naisCluster === NaisEnvironment.DEV
export const isNais = isProd || isDev
export const isLocal = !isNais

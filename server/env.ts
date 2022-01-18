export enum NaisEnvironment {
    PROD = "prod-gcp",
    DEV = "dev-gcp",
    LOCAL = "local",
}

export const isProd = process.env.NAIS_CLUSTER_NAME === NaisEnvironment.PROD
export const isDev = process.env.NAIS_CLUSTER_NAME === NaisEnvironment.DEV
export const isNais = isProd || isDev
export const isLocal = !isNais

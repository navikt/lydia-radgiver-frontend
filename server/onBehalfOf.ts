import axios from "axios";
import {NextFunction, Request, Response} from "express";
import {URLSearchParams} from "url";
import {Azure, Config} from "./config";
import { AuthError } from "./error";
import logger from "./logging"
import {JWKSetRetriever} from "./jwks";
import { jwtVerify, errors } from "jose"


export const onBehalfOfTokenMiddleware = (config : Config) => async (req : Request, res : Response, next : NextFunction) => { 
    const bearerToken = getBearerToken(req);
    if (!bearerToken) return next(new AuthError("Mangler token i auth header"))
    hentOnBehalfOfToken(bearerToken, config)
        .then(oboToken => {
            res.locals.on_behalf_of_token = oboToken
            return next()
        })
        .catch(error => next(error))
}

export const validerAccessToken = (accessToken: string, azure: Azure, jwkSet: JWKSetRetriever): Promise<void> => {
    const options = {
        algorithms: ["RS256"],
        audience: azure.clientId,
        issuer: azure.issuer,
    };
    return jwtVerify(accessToken, jwkSet, options)
        .then(() => Promise.resolve())
        .catch(error => {
            let feilmelding: string
            if (error instanceof errors.JWTExpired) {
                feilmelding = "Token har utløpt"
            } else if (error instanceof errors.JWTInvalid) {
                feilmelding = "Payload i tokenet må være gyldig JSON!"
            } else if (error instanceof errors.JWTClaimValidationFailed) {
                logger.error(`Received error: ${error.message} with claim ${error.claim} and reason ${error.reason}`)
                feilmelding = `Token mottatt har ugyldig claim ${error.claim}`
            } else {
                feilmelding = "Tokenet er ikke gyldig"
                logger.error("Ukjent feil: " + error.message)
            }
            return Promise.reject(new AuthError(feilmelding))
        })
}

export function getBearerToken(req: Request) {
    return req.headers?.authorization?.substring("Bearer ".length);
}

export const validerTokenFraWonderwall = (azure: Azure, jwkSet: JWKSetRetriever) => async (req : Request, res : Response, next : NextFunction) => {
    const bearerToken = getBearerToken(req);
    if (!bearerToken) return next(new AuthError("Mangler token i auth header"))
    validerAccessToken(bearerToken, azure, jwkSet)
        .then(() => next())
        .catch(e => next(e))
}

export const validerTokenFraFakedings = async (req : Request, res : Response, next : NextFunction) => {
    return next()
}

export const hentOnBehalfOfToken = async (accessToken: string, config : Config) : Promise<string> => {
    // OBO flyt som beskrevet her:
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#first-case-access-token-request-with-a-shared-secret
    const scope = config.lydiaApi.scope
    const params = new URLSearchParams()
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
    params.append("client_id", config.azure.clientId)
    params.append("client_secret", config.azure.clientSecret)
    params.append("assertion", accessToken)
    params.append("scope", scope)
    params.append("requested_token_use", "on_behalf_of")

    try {
        const result = await axios.post<AzureTokenResponse>(config.azure.tokenEndpoint, params, {headers: {"content-type": "application/x-www-form-urlencoded"}})
        return result.data.access_token;
    } catch (error) {
        if (error instanceof Error) {
            throw new AuthError(`Feil under uthenting av OBO token: ${error.message}`)
        }
    }
}


export interface AzureTokenResponse {
    token_type: string;
    scope: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    refresh_token: string;
}
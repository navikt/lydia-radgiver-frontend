import axios from "axios";
import {NextFunction, Request, Response} from "express";
import jwt, { JwtPayload, NotBeforeError, TokenExpiredError, VerifyErrors } from "jsonwebtoken"
import {URLSearchParams} from "url";
import {Azure, Config} from "./config";
import { AuthError } from "./error";
import logger from "./logging"


export const validerAccessToken = (accessToken: string, azure : Azure) : void => {
    const options : jwt.VerifyOptions = {
        algorithms: ["RS256"],
        audience: azure.clientId,
        issuer: azure.issuer,
        ignoreExpiration: false,
        ignoreNotBefore: false,
    }

    jwt.verify(accessToken, azure.clientSecret, options, (error : VerifyErrors, dekodetToken : JwtPayload) => {
        if (!error){
            const secondsSinceEpoch = Math.round(new Date().getTime() / 1000)
            const tokenHarGyldigIssuedAt = dekodetToken.iat < secondsSinceEpoch
            
            // const tokenErUtløpt = dekodetToken.exp < secondsSinceEpoch
            // const tokenHarGyldigIssuedAt = dekodetToken.iat < secondsSinceEpoch
            // const tokenHarGyldigIssuer = dekodetToken.iss === azure.issuer
            // const tokenHarGyldigAudience = dekodetToken.aud === azure.clientId
            if (!tokenHarGyldigIssuedAt) {
                throw new AuthError("Token har ikke gyldig issuedAt")
            }
            return
        } 
        let feilmelding : string;
        if (error instanceof TokenExpiredError) {
            feilmelding = "Tokenet er utløpt"
        }
        else if (error instanceof NotBeforeError) {
            feilmelding = "Tokenet er ikke gyldig enda"
        }
        else {
            feilmelding = "Tokenet er ikke gyldig"
            logger.error("Ukjent feil: " + error.message)
        }
        throw new AuthError(feilmelding)
    })
}

export function getBearerToken(req: Request) {
    return req.headers?.authorization?.substring("Bearer ".length);
}

export const validerTokenFraWonderwall = (azure : Azure) => async (req : Request, res : Response, next : NextFunction) => {
    const bearerToken = getBearerToken(req);
    validerAccessToken(bearerToken, azure)
    if (!bearerToken) return next(new AuthError("Mangler token i auth header"))
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
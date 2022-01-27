import axios from "axios";
import {NextFunction, Request, Response} from "express";
import {URLSearchParams} from "url";

// OBO flyt som beskrevet her:
// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#first-case-access-token-request-with-a-shared-secret


const config = {
    clientId: process.env.AZURE_APP_CLIENT_ID,
    tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
}

export const onBehalfOfTokenMiddleWare = (scope : string) => async (req : Request, res : Response, next : NextFunction) => {
    const bearerToken = req.headers?.authorization?.substring("Bearer ".length);
    if (!bearerToken) return next(new AuthError("Mangler token i auth header"))
    try {
        req.azure_obo_token = await hentOnBehalfOfToken(scope, bearerToken)
        return next()
    } catch (e) {
        return next(e)
    }
}

export const hentOnBehalfOfToken = async (scope : string, accessToken: string): Promise<string> => {
    const params = new URLSearchParams()
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
    params.append("client_id", config.clientId)
    params.append("client_secret", config.clientSecret)
    params.append("assertion", accessToken)
    params.append("scope", scope)
    params.append("requested_token_use", "on_behalf_of")

    const result = await axios.post<AzureTokenResponse>(config.tokenEndpoint, params, {headers: {"content-type": "application/x-www-form-urlencoded"}})
        .catch(error => {
            throw new AuthError(`Feil under uthenting av OBO token: ${error.message}`);
        })
    return result.data.access_token;
}

export interface AzureTokenResponse {
    token_type: string;
    scope: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    refresh_token: string;
}

export interface AzureAdAccessToken {
    aud: string;
    iss: string;
    iat: number;
    nbf: number;
    exp: number;
    aio: string;
    azp: string;
    azpacr: string;
    groups: string[];
    name: string;
    oid: string;
    preferred_username: string;
    rh: string;
    scp: string;
    sub: string;
    tid: string;
    uti: string;
    ver: string;
    NAVident: string;
}

export class AuthError extends Error {
}
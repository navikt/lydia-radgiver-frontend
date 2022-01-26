import axios from "axios";
import { Request, Response, NextFunction } from "express";
import {URLSearchParams} from "url";

// OBO flyt som beskrevet her:
// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#first-case-access-token-request-with-a-shared-secret


const config = {
    clientId: process.env.AZURE_APP_CLIENT_ID,
    tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
}

const requestHarBearerToken = (req : Request) => {
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer ");
}

export const onBehalfOfTokenMiddleWare = (scope : string) => (req : Request, res : Response, next : NextFunction) => {
    if (!requestHarBearerToken(req)) return next();
    const bearerToken = req.headers.authorization.substring("Bearer ".length);
    if (!bearerToken) return next()
    const onBehalfOfToken = hentOnBehalfOfToken(scope, bearerToken)
    req.headers["Authorization"] = `Bearer ${onBehalfOfToken}`
    return next()
}

export const hentOnBehalfOfToken = async (scope : string, accessToken: string): Promise<string> => {
    const params = new URLSearchParams()
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
    params.append("client_id", config.clientId)
    params.append("client_secret", config.clientSecret)
    params.append("assertion", accessToken)
    params.append("scope", scope)
    params.append("requested_token_use", "on_behalf_of")

    return await axios.post(config.tokenEndpoint, params, {headers: {"content-type": "application/x-www-form-urlencoded"}})
        .then(response => response.data.access_token)
        .catch(error => {
            console.error("Feil under uthenting av OBO token", error);
            throw error;
        })
}
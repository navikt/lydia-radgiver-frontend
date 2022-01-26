import axios from "axios";
import {URLSearchParams} from "url";


// OBO flyt som beskrevet her:
// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#first-case-access-token-request-with-a-shared-secret


const config = {
    clientId: process.env.AZURE_APP_CLIENT_ID,
    tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
    lydiaApiScope: "api://lydia-api/.default"
}


export const hentOnBehalfOfToken = async (accessToken: string): Promise<string> => {
    const params = new URLSearchParams()
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
    params.append("client_id", config.clientId)
    params.append("client_secret", config.clientSecret)
    params.append("assertion", accessToken)
    params.append("scope", config.lydiaApiScope)
    params.append("requested_token_use", "on_behalf_of")

    // TODO sjekk at vi håndterer feil
    return axios.post(config.tokenEndpoint, params, {headers: {"content-type": "application/x-www-form-urlencoded"}})
}
import https from 'https';

const tokenEndpoint = "TODO login microSoft"
const clientId = "TODO loging microSoft"


// OBO flyt som beskrevet her: 
// https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#first-case-access-token-request-with-a-shared-secret



const config = {
    clientId : process.env.AZURE_APP_CLIENT_ID,
    tokenEndpoint : process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
    clientSecret : process.env.AZURE_APP_CLIENT_SECRET,
}


export const hentOnBehalfOfToken = async (targetAzureClientId : string, accessToken : string) : Promise => {
    const options = {
        uri: config.tokenEndpoint,
        json: true,
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            client_id: config.clientId,
            client_secret: config.clientSecret,
            assertion: accessToken,
            scope: targetAzureClientId,
            requested_token_use: 'on_behalf_of',
        },
    }
    

    const req = https.request(options)

    req.end

}
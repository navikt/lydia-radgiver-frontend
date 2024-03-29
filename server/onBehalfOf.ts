import { NextFunction, Request, Response } from "express";
import { URLSearchParams } from "url";
import { Azure, Config } from "./config";
import { AuthError } from "./error";
import logger from "./logging";
import { JWKSetRetriever } from "./jwks";
import { jwtVerify, errors, decodeJwt, JWTPayload } from "jose";
import { decrypt, encrypt } from "./crypto";
import { redisCacheHitCounter } from "./metrikker";

const EXPIRY_THRESHOLD_SECONDS = 5;

export const onBehalfOfTokenMiddleware =
    (config: Config) => async (req: Request, res: Response, next: NextFunction) => {
        const bearerToken = getBearerToken(req);
        if (!bearerToken) return next(new AuthError("Mangler token i auth header"));
        hentOnBehalfOfToken(bearerToken, config, req)
            .then((oboToken) => {
                res.locals.on_behalf_of_token = oboToken;
                return next();
            })
            .catch((error) => next(error));
    };

export const validerAccessToken = (
    accessToken: string,
    azure: Azure,
    jwkSet: JWKSetRetriever
): Promise<void> => {
    const options = {
        algorithms: ["RS256"],
        audience: azure.clientId,
        issuer: azure.issuer,
    };
    return jwtVerify(accessToken, jwkSet, options)
        .then(() => Promise.resolve())
        .catch((error) => {
            let feilmelding: string;
            if (error instanceof errors.JWTExpired) {
                feilmelding = "Token har utløpt";
            } else if (error instanceof errors.JWTInvalid) {
                feilmelding = "Payload i tokenet må være gyldig JSON!";
            } else if (error instanceof errors.JWTClaimValidationFailed) {
                logger.error(
                    `Received error: ${error.message} with claim ${error.claim} and reason ${error.reason}`
                );
                feilmelding = `Token mottatt har ugyldig claim ${error.claim}`;
            } else {
                feilmelding = "Tokenet er ikke gyldig";
                logger.error("Ukjent feil under verifisering: " + error.message);
            }
            return Promise.reject(new AuthError(feilmelding));
        });
};

export function getBearerToken(req: Request) {
    return req.headers?.authorization?.substring("Bearer ".length);
}

export const validerTokenFraWonderwall =
    (azure: Azure, jwkSet: JWKSetRetriever) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const bearerToken = getBearerToken(req);
        if (!bearerToken) return next(new AuthError("Mangler token i auth header"));
        validerAccessToken(bearerToken, azure, jwkSet)
            .then(() => next())
            .catch((e) => next(e));
    };

export const validerTokenFraFakedings =
    (azure: Azure, _) =>
    async (req: Request, res: Response, next: NextFunction) => {
        res.locals.on_behalf_of_token = await fetch(azure.tokenEndpoint);
        return next();
    };

export const hentOnBehalfOfToken = async (
    accessToken: string,
    config: Config,
    req: Request
): Promise<string> => {
    const encryptedObo = req.session.azureOboToken;

    async function fetchOboToken() {
        // OBO flyt som beskrevet her:
        // https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#first-case-access-token-request-with-a-shared-secret
        const scope = config.lydiaApi.scope;
        const params = new URLSearchParams();
        params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
        params.append("client_id", config.azure.clientId);
        params.append("client_secret", config.azure.clientSecret);
        params.append("assertion", accessToken);
        params.append("scope", scope);
        params.append("requested_token_use", "on_behalf_of");
        try {
            const result = await fetch(config.azure.tokenEndpoint, {
                method: "POST",
                headers : {
                    "content-type": "application/x-www-form-urlencoded"
                },
                body: params
            }).then((res) => res.json())
            .then((data) => data as AzureTokenResponse)

            req.session.accessToken = await encrypt(accessToken)
            req.session.azureOboToken = await encrypt(result.access_token);
            return result.access_token;
        } catch (error) {
            if (error instanceof Error) {
                throw new AuthError("Ukjent feil under token exchange: " + error.message);
            }
        }
    }

    if (encryptedObo && await decrypt(req.session.accessToken) === accessToken) {
        redisCacheHitCounter.inc();
        const oboToken = await decrypt(encryptedObo);
        return isValid(decodeJwt(oboToken)) ? oboToken : await fetchOboToken();
    } else {
        return await fetchOboToken();
    }
};

function isValid({ exp: expireTime }: JWTPayload) {
    const timeCheck = Math.floor(Date.now() / 1000) + EXPIRY_THRESHOLD_SECONDS;
    return timeCheck < expireTime;
}

export interface AzureTokenResponse {
    token_type: string;
    scope: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    refresh_token: string;
}

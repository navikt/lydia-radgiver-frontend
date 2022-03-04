import { NextFunction, Request, Response } from "express";
import { decodeJwt } from "jose";
import { AuthError } from "./error";
import { getBearerToken } from "./onBehalfOf";

const lokalMockBruker = {
    navn: "Ansatt, Lokal",
    ident: "A123456",
    epost: "lokal.ansatt@nav.no",
};

export const hentInnloggetAnsattMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (process.env.NAIS_CLUSTER_NAME === "lokal") {
        res.send(lokalMockBruker);
    } else {
        const bearerToken = getBearerToken(req);
        if (!bearerToken) {
            return next(new AuthError("Mangler token i auth header"));
        }
        const claims = decodeJwt(bearerToken);
        const navn = claims["name"];
        const ident = claims["NAVident"];
        const preferredUsername = claims["preferred_username"];
        return res.send({
            navn: navn,
            ident: ident,
            epose: preferredUsername,
        });
    }
};

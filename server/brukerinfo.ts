import { NextFunction, Request, Response } from "express";
import { decodeJwt } from "jose";
import { AuthError } from "./error";
import { getBearerToken } from "./onBehalfOf";

type NavAnsatt = {
    navn: string;
    ident: string;
    epost: string;
};

const lokalMockBruker: NavAnsatt = {
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
        const navn = claims["name"] as string;
        const ident = claims["NAVident"] as string;
        const preferredUsername = claims["preferred_username"] as string;
        const navAnsatt: NavAnsatt = {
            navn: navn,
            ident: ident,
            epost: preferredUsername,
        };
        return res.send(navAnsatt);
    }
};

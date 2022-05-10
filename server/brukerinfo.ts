import {NextFunction, Request, Response} from "express";
import {decodeJwt, JWTPayload} from "jose";
import {AuthError} from "./error";
import {getBearerToken} from "./onBehalfOf";

export type Brukerinformasjon = {
    navn: string;
    ident: string;
    epost: string;
    tokenUtløper: number
};

const lokalMockBruker: Brukerinformasjon = {
    navn: "Ansatt, Lokal",
    ident: "A123456",
    epost: "lokal.ansatt@nav.no",
    tokenUtløper: Date.now() + 5000
};

export const hentBrukerinfoFraToken = (jwtPayload : JWTPayload) : Brukerinformasjon => {
    const navn = jwtPayload["name"] as string;
    const ident = jwtPayload["NAVident"] as string;
    const preferredUsername = jwtPayload["preferred_username"] as string;
    const tokenUtløper = jwtPayload.exp * 1000 // konverterer fra sekunder til ms
    return {
        navn: navn,
        ident: ident,
        epost: preferredUsername,
        tokenUtløper: tokenUtløper
    }
}

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
        const jwtPayload = decodeJwt(bearerToken);
        return res.send(hentBrukerinfoFraToken(jwtPayload));
    }
};

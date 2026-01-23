import { NextFunction, Request, Response } from "express";
import { JWTPayload } from "jose";
import { AuthError } from "./error";
import { getBearerToken } from "./onBehalfOf";
import { inLocalMode } from "./app";
import { JWKSetRetriever, verifiserAzureToken } from "./jwks";
import { Azure } from "./config";

export type Brukerinformasjon = {
    navn: string;
    ident: string;
    epost: string;
    tokenUtloper: number;
    rolle: string;
};

const lokalMockBruker: Brukerinformasjon = {
    navn: "Ansatt, Lokal",
    ident: "A123456",
    epost: "lokal.ansatt@nav.no",
    tokenUtloper: Date.now() + 5000,
    rolle: "Superbruker",
};

const enum Rolle {
    SUPERBRUKER = "Superbruker",
    SAKSBEHANDLER = "Saksbehandler",
    LESETILGANG = "Lesetilgang",
}

function fiaRoller() {
    return {
        superbruker: {
            gruppeId: process.env.FIA_SUPERBRUKER_GROUP_ID,
        },
        saksbehandler: {
            gruppeId: process.env.FIA_SAKSBEHANDLER_GROUP_ID,
        },
        lesetilgang: {
            gruppeId: process.env.FIA_LESETILGANG_GROUP_ID,
        },
        teamPia: {
            gruppeId: process.env.TEAM_PIA_GROUP_ID,
        },
    };
}

const hentRolleMedHøyestTilgang = (brukerGrupper: string[]): Rolle => {
    const fiaGrupper = fiaRoller();
    if (brukerGrupper.includes(fiaGrupper.superbruker.gruppeId)) {
        return Rolle.SUPERBRUKER;
    } else if (brukerGrupper.includes(fiaGrupper.saksbehandler.gruppeId)) {
        return Rolle.SAKSBEHANDLER;
    } else if (
        brukerGrupper.includes(fiaGrupper.lesetilgang.gruppeId) ||
        brukerGrupper.includes(fiaGrupper.teamPia.gruppeId)
    ) {
        return Rolle.LESETILGANG;
    } else {
        throw new AuthError("Ikke riktig tilgang");
    }
};

export const hentBrukerinfoFraToken = (
    jwtPayload: JWTPayload,
): Brukerinformasjon => {
    const navn = jwtPayload["name"] as string;
    const ident = jwtPayload["NAVident"] as string;
    const rolle = hentRolleMedHøyestTilgang(jwtPayload["groups"] as string[]);
    const epost = jwtPayload["preferred_username"] as string;
    const tokenUtloper = jwtPayload.exp * 1000; // konverterer fra sekunder til ms
    return {
        navn,
        ident,
        epost,
        tokenUtloper,
        rolle,
    };
};

export const hentInnloggetAnsattMiddleware =
    (azure: Azure, jwkSet: JWKSetRetriever) =>
    async (req: Request, res: Response, next: NextFunction) => {
        if (inLocalMode()) {
            res.send(lokalMockBruker);
        } else {
            const bearerToken = getBearerToken(req);
            if (!bearerToken) {
                return next(new AuthError("Mangler token i auth header"));
            }
            const { payload: jwtPayload } = await verifiserAzureToken(
                bearerToken,
                azure,
                jwkSet,
            );
            return res.send(hentBrukerinfoFraToken(jwtPayload));
        }
    };

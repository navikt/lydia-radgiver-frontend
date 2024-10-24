import { z } from "zod";
import {
    BrukerITeamDTO,
    brukerITeamSchema,
} from "../../domenetyper/brukeriteam";
import { httpDelete, post, useSwrTemplate } from "./networkRequests";
import { iaSakTeamPath } from "./paths";

export const useHentTeam = (saksnummer?: string) => {
    return useSwrTemplate<string[]>(
        saksnummer ? `${iaSakTeamPath}/${saksnummer}` : null,
        z.string().array(),
    );
};

export const leggBrukerTilTeam = (
    saksnummer: string,
): Promise<BrukerITeamDTO> => {
    return post(`${iaSakTeamPath}/${saksnummer}`, brukerITeamSchema);
};

export const fjernBrukerFraTeam = (
    saksnummer: string,
): Promise<BrukerITeamDTO> => {
    return httpDelete(`${iaSakTeamPath}/${saksnummer}`, brukerITeamSchema);
};

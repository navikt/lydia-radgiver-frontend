import { z } from "zod/v4";
import {
    httpDelete,
    post,
    useSwrTemplate,
} from "@/api/lydia-api/networkRequests";
import { iaSakTeamPath } from "@/api/lydia-api/paths";
import {
    BrukerITeamDTO,
    brukerITeamSchema,
} from "@features/bruker/types/brukeriteam";

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

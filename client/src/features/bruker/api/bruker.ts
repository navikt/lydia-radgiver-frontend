import { useSwrTemplate } from "@/api/lydia-api/networkRequests";
import { innloggetAnsattPath } from "@/api/lydia-api/paths";
import {
    Brukerinformasjon,
    brukerinformasjonSchema,
} from "@features/bruker/types/brukerinformasjon";

export const useHentBrukerinformasjon = () =>
    useSwrTemplate<Brukerinformasjon>(
        innloggetAnsattPath,
        brukerinformasjonSchema,
    );

export const erSaksbehandler = (bruker: Brukerinformasjon | undefined) =>
    bruker &&
    (bruker.rolle === "Saksbehandler" || bruker.rolle === "Superbruker");

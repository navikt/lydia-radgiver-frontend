import {
    Brukerinformasjon,
    brukerinformasjonSchema,
} from "../../domenetyper/brukerinformasjon";
import { useSwrTemplate } from "./networkRequests";
import { innloggetAnsattPath } from "./paths";

export const useHentBrukerinformasjon = () =>
    useSwrTemplate<Brukerinformasjon>(
        innloggetAnsattPath,
        brukerinformasjonSchema,
    );

export const erSaksbehandler = (bruker: Brukerinformasjon | undefined) =>
    bruker &&
    (bruker.rolle === "Saksbehandler" || bruker.rolle === "Superbruker");

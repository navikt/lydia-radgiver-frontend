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

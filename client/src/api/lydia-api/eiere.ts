import useSWR from "swr";
import { z } from "zod/v4";
import { eierSchema } from "../../domenetyper/domenetyper";
import { eierePath } from "./paths";
import { defaultSwrConfiguration, post } from "./networkRequests";

const eierListeSchema = z.array(eierSchema);

export const useHentEiere = (navIdenter: string[]) => {
    const unikeNavIdenter = [...new Set(navIdenter)].sort();
    const { data } = useSWR(
        unikeNavIdenter.length > 0 ? [eierePath, unikeNavIdenter] : null,
        ([url, identer]: [string, string[]]) =>
            post(url, eierListeSchema, identer).then((respons) =>
                eierListeSchema.parse(respons),
            ),
        defaultSwrConfiguration,
    );
    return data ?? [];
};

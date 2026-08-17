import useSWR from "swr";
import { z } from "zod/v4";
import { eierSchema } from "../../domenetyper/domenetyper";
import { eiereNavnPath, radgivereNavnPath } from "./paths";
import { defaultSwrConfiguration, post } from "./networkRequests";

const navnListeSchema = z.array(eierSchema);

export type NavnOppslag = "eiere" | "radgivere";

export const useHentNavnForSaksnumre = (
    saksnumre: string[],
    oppslag: NavnOppslag,
) => {
    const unikeSaksnumre = [...new Set(saksnumre)].sort();
    const path = oppslag === "eiere" ? eiereNavnPath : radgivereNavnPath;

    const { data } = useSWR(
        unikeSaksnumre.length > 0 ? [path, unikeSaksnumre] : null,
        ([url, numre]: [string, string[]]) => post(url, navnListeSchema, numre),
        defaultSwrConfiguration,
    );

    return data ?? [];
};

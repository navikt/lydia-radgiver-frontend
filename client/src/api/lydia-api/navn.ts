import useSWR from "swr";
import { z } from "zod/v4";
import { eierSchema } from "../../domenetyper/domenetyper";
import { aktorerNavnPath, eiereNavnPath, radgivereNavnPath } from "./paths";
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

const aktørForHendelseSchema = z.object({
    hendelseId: z.string(),
    aktor: eierSchema,
});
const aktørerListeSchema = z.array(aktørForHendelseSchema);

export const useHentAktorerForHendelser = (
    saksnummer: string,
    hendelseIder: string[],
) => {
    const unikeHendelseIder = [...new Set(hendelseIder)].sort();

    const { data } = useSWR(
        unikeHendelseIder.length > 0
            ? [aktorerNavnPath(saksnummer), unikeHendelseIder]
            : null,
        ([url, ider]: [string, string[]]) =>
            post(url, aktørerListeSchema, ider),
        defaultSwrConfiguration,
    );

    return data ?? [];
};

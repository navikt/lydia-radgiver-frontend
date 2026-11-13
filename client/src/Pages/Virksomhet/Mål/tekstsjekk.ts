import { sjekkPersonopplysninger } from "../../../api/lydia-api/personopplysningssjekk";
import { IASak } from "../../../domenetyper/domenetyper";
import { Sjekkutfall } from "./målskjema";

export async function sjekkTekst(
    iaSak: IASak,
    tekst: string,
): Promise<Sjekkutfall | undefined> {
    try {
        const resultat = await sjekkPersonopplysninger(
            iaSak.orgnr,
            iaSak.saksnummer,
            tekst,
        );
        return resultat.kanInneholdePersonopplysninger
            ? { status: "funn", resultat }
            : undefined;
    } catch {
        return { status: "feilet" };
    }
}

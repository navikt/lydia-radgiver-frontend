import { KvartalFraTil } from "../domenetyper/kvartalTyper";

export const getGjeldendePeriodeTekst = (gjeldendePeriode: KvartalFraTil | undefined) => {
    if (gjeldendePeriode) {
        return ` (${gjeldendePeriode.fra.kvartal}. kvartal ${gjeldendePeriode.fra.årstall} 
                      – 
                      ${gjeldendePeriode.til.kvartal}. kvartal ${gjeldendePeriode.til.årstall})`
    }
    return "";
}

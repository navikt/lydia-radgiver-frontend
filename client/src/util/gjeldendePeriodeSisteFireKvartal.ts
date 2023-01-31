import { KvartalFraTil } from "../domenetyper/domenetyper";

export const getGjeldendePeriodeTekst = (gjeldendePeriode: KvartalFraTil | undefined) => {
    if (gjeldendePeriode) {
        return ` (${gjeldendePeriode.fra.kvartal}. kvartal ${gjeldendePeriode.fra.årstall} 
                      – 
                      ${gjeldendePeriode.til.kvartal}. kvartal ${gjeldendePeriode.til.årstall})`
    }
    return "";
}

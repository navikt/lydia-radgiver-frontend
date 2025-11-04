import { FiltervisningState } from "./Filter/filtervisning-reducer";
import {
    FilterverdiKategorier,
    loggFilterverdiKategorier,
    Søkekomponenter,
} from "../../util/analytics-klient";
import { ValgtSnittFilter } from "../../domenetyper/filterverdier";

export const loggSøkMedFilterIAmplitude = (
    filtervisningstate: FiltervisningState,
    søkekomponent:
        | Søkekomponenter.PRIORITERING
        | Søkekomponenter.STATUSOVERSIKT,
) => {
    const filter = [
        /* Filter som er enkeltverdiar */
        {
            vilkår: filtervisningstate.sektor,
            filterverdiKategori: FilterverdiKategorier.SEKTOR,
        },
        {
            vilkår: filtervisningstate.iaStatus,
            filterverdiKategori: FilterverdiKategorier.STATUS,
        },
        /* Filter som er lister */
        {
            vilkår: filtervisningstate.valgteFylker,
            filterverdiKategori: FilterverdiKategorier.FYLKE,
        },
        {
            vilkår: filtervisningstate.kommuner.length,
            filterverdiKategori: FilterverdiKategorier.KOMMUNE,
        },
        {
            vilkår: filtervisningstate.bransjeprogram.length,
            filterverdiKategori: FilterverdiKategorier.BRANSJE,
        },
        {
            vilkår: filtervisningstate.næringsgrupper.length,
            filterverdiKategori: FilterverdiKategorier.NÆRINGSGRUPPE,
        },
        {
            vilkår: filtervisningstate.eiere?.length,
            filterverdiKategori: FilterverdiKategorier.EIER,
        },
        /* Filter som er rekkevidde (range, frå/til) */
        {
            vilkår: filtervisningstate.sykefraværsprosent.fra > 0,
            filterverdiKategori: FilterverdiKategorier.SYKEFRAVÆR_FRA,
        },
        {
            vilkår: filtervisningstate.sykefraværsprosent.til < 100,
            filterverdiKategori: FilterverdiKategorier.SYKEFRAVÆR_TIL,
        },
        {
            vilkår: filtervisningstate.antallArbeidsforhold.fra != 5,
            filterverdiKategori: FilterverdiKategorier.ARBEIDSFORHOLD_FRA,
        },
        {
            vilkår: filtervisningstate.antallArbeidsforhold.til,
            filterverdiKategori: FilterverdiKategorier.ARBEIDSFORHOLD_TIL,
        },
        /* Filter der vi loggar ulik input kvar for seg */
        {
            vilkår:
                filtervisningstate.valgtSnittfilter ===
                ValgtSnittFilter.BRANSJE_NÆRING_OVER,
            filterverdiKategori: FilterverdiKategorier.BRANSJE_NÆRING_OVER,
        },
        {
            vilkår:
                filtervisningstate.valgtSnittfilter ===
                ValgtSnittFilter.BRANSJE_NÆRING_UNDER_ELLER_LIK,
            filterverdiKategori:
                FilterverdiKategorier.BRANSJE_NÆRING_UNDER_ELLER_LIK,
        },
    ];

    const kategorierSomSkalLogges: FilterverdiKategorier[] = filter
        .filter((it) => it.vilkår)
        .map((it) => it.filterverdiKategori);

    loggFilterverdiKategorier(kategorierSomSkalLogges, søkekomponent);
};

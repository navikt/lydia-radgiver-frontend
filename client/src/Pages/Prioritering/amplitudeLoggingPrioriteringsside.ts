import { FiltervisningState } from "./Filter/filtervisning-reducer";
import {
    FilterverdiKategorier,
    loggFilterverdiKategorier,
    loggSøkPåFylke,
    Søkekomponenter
} from "../../util/amplitude-klient";
import { Filterverdier, ValgtSnittFilter } from "../../domenetyper/filterverdier";
import { finnFylkerForKommuner } from "../../util/finnFylkeForKommune";

export const loggSøkPåFylkeIAmplitude = (filtervisningstate: FiltervisningState, filterverdier: Filterverdier) => {
    if (filtervisningstate.valgtFylke) {
        return loggSøkPåFylke(
            filtervisningstate.valgtFylke.fylke,
            "sykefraversstatistikk?fylker",
            Søkekomponenter.PRIORITERING
        )
    } else if (filtervisningstate.kommuner && filterverdier) { // Om fylke er vald må alle kommunar høyre til det fylket, så vi treng ikkje mappe tilbake til fylke.
        const fylker = finnFylkerForKommuner(filtervisningstate.kommuner, filterverdier.fylker);

        fylker.map((fylke) => {
                return loggSøkPåFylke(
                    fylke,
                    "sykefraversstatistikk?kommuner",
                    Søkekomponenter.PRIORITERING
                )
            }
        )
    }
}

export const loggSøkMedFilterIAmplitude = (filtervisningstate: FiltervisningState) => {
    const filter = [
        /* Filter som er enkeltverdiar */
        {
            vilkår: filtervisningstate.valgtFylke,
            filterverdiKategori: FilterverdiKategorier.FYLKE,
        }, {
            vilkår: filtervisningstate.sektor,
            filterverdiKategori: FilterverdiKategorier.SEKTOR,
        }, {
            vilkår: filtervisningstate.iaStatus,
            filterverdiKategori: FilterverdiKategorier.STATUS,
        },
        /* Filter som er lister */
        {
            vilkår: filtervisningstate.kommuner.length,
            filterverdiKategori: FilterverdiKategorier.KOMMUNE,
        }, {
            vilkår: filtervisningstate.bransjeprogram.length,
            filterverdiKategori: FilterverdiKategorier.BRANSJE,
        }, {
            vilkår: filtervisningstate.næringsgrupper.length,
            filterverdiKategori: FilterverdiKategorier.NÆRINGSGRUPPE,
        }, {
            vilkår: filtervisningstate.eiere?.length,
            filterverdiKategori: FilterverdiKategorier.EIER,
        },
        /* Filter som er rekkevidde (range, frå/til) */
        {
            vilkår: filtervisningstate.sykefraværsprosent.fra > 0,
            filterverdiKategori: FilterverdiKategorier.SYKEFRAVÆR_FRA,
        }, {
            vilkår: filtervisningstate.sykefraværsprosent.til < 100,
            filterverdiKategori: FilterverdiKategorier.SYKEFRAVÆR_TIL,
        }, {
            vilkår: filtervisningstate.antallArbeidsforhold.fra != 5,
            filterverdiKategori: FilterverdiKategorier.ARBEIDSFORHOLD_FRA,
        }, {
            vilkår: filtervisningstate.antallArbeidsforhold.til,
            filterverdiKategori: FilterverdiKategorier.ARBEIDSFORHOLD_TIL,
        },
        /* Filter der vi loggar ulik input kvar for seg */
        {
            vilkår: filtervisningstate.valgtSnittfilter === ValgtSnittFilter.BRANSJE_NÆRING_OVER,
            filterverdiKategori: FilterverdiKategorier.BRANSJE_NÆRING_OVER,
        }, {
            vilkår: filtervisningstate.valgtSnittfilter === ValgtSnittFilter.BRANSJE_NÆRING_UNDER_ELLER_LIK,
            filterverdiKategori: FilterverdiKategorier.BRANSJE_NÆRING_UNDER_ELLER_LIK,
        },
    ]

    filter.map((filter) => {
        if (filter.vilkår) {
            loggFilterverdiKategorier(
                filter.filterverdiKategori,
                "sykefraversstatistikk",
                Søkekomponenter.PRIORITERING
            )
        }
    })
}

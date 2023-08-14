import { useEffect, useState } from "react";
import { BodyShort, Loader, SortState } from "@navikt/ds-react";
import { Filtervisning } from "./Filter/Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import { useFilterverdier, useHentAntallTreff, useHentVirksomhetsoversiktListe, } from "../../api/lydia-api";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import { FiltervisningState, useFiltervisningState } from "./Filter/filtervisning-reducer";
import { Virksomhetsoversikt } from "../../domenetyper/virksomhetsoversikt";
import { SideContainer } from "../../styling/containere";
import {
    FilterverdiKategorier,
    loggFilterverdiKategorier,
    loggSideLastet,
    loggSøkPåFylke,
    Søkekomponenter
} from "../../util/amplitude-klient";
import { finnFylkerForKommuner } from "../../util/finnFylkeForKommune";
import { Filterverdier } from "../../domenetyper/filterverdier";

export const ANTALL_RESULTATER_PER_SIDE = 100;

export const Prioriteringsside = () => {
    useTittel(statiskeSidetitler.prioriteringsside);

    const [sortering, setSortering] = useState<SortState>({
        direction: "descending",
        orderBy: "tapte_dagsverk",
    });

    const [skalSøke, setSkalSøke] = useState(false);
    const [virksomhetsoversiktListe, setVirksomhetsoversiktListe] = useState<Virksomhetsoversikt[]>();
    const [totaltAntallTreff, setTotaltAntallTreff] = useState<number>()
    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const { data: filterverdier } = useFilterverdier();
    const filtervisning = useFiltervisningState();
    const harSøktMinstEnGang = virksomhetsoversiktListe !== undefined;
    const fantResultaterISøk = harSøktMinstEnGang && virksomhetsoversiktListe.length > 0;

    const {
        data: virksomhetsoversiktListeRespons,
        loading: lasterVirksomhetsoversiktListe,
        error: virksomhetsoversiktListeFeil,
    } = useHentVirksomhetsoversiktListe({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });

    const skalViseTabell = fantResultaterISøk && !lasterVirksomhetsoversiktListe;

    const {
        data: antallTreff,
        loading: henterAntallTreff,
    } = useHentAntallTreff({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });

    const stoppSøkingOmViHarFåttSvarPåAlt = () => {
        if (virksomhetsoversiktListeRespons && antallTreff) {
            setSkalSøke(false);
        }
    }

    useEffect(() => {
        if (filterverdier && !filtervisningLoaded) {
            filtervisning.lastData({ filterverdier });
            setFiltervisningLoaded(true);
            loggSideLastet("Prioriteringsside");
        }
    }, [filterverdier, filtervisningLoaded]);

    useEffect(() => {
        if (virksomhetsoversiktListeRespons) {
            setVirksomhetsoversiktListe(virksomhetsoversiktListeRespons.data);
            stoppSøkingOmViHarFåttSvarPåAlt()
        }
    }, [virksomhetsoversiktListeRespons]);

    useEffect(() => {
        if (antallTreff) {
            setTotaltAntallTreff(antallTreff);
            stoppSøkingOmViHarFåttSvarPåAlt()
        }
    }, [antallTreff, henterAntallTreff]);

    function oppdaterSide(side: number, sortering?: SortState) {
        filtervisning?.state && filterverdier && loggSøkPåFylkeIAmplitude(filtervisning.state, filterverdier)
        loggSøkMedFilterIAmplitude(filtervisning.state)

        filtervisning.oppdaterSide({
            side,
            sortering,
        });
        setSkalSøke(true);
    }

    return (
        <SideContainer>
            <Filtervisning
                filtervisning={filtervisning}
                søkPåNytt={() => {
                    setTotaltAntallTreff(undefined)
                    oppdaterSide(1);
                }}
            />
            <br />
            {skalViseTabell ? (
                <PrioriteringsTabell
                    virksomhetsoversiktListe={virksomhetsoversiktListe}
                    endreSide={(side) => {
                        oppdaterSide(side);
                    }}
                    sortering={sortering}
                    endreSortering={(sortering) => {
                        setSortering(sortering);
                        oppdaterSide(1, sortering);
                    }}
                    side={filtervisning.state.side}
                    totaltAntallTreff={totaltAntallTreff}
                />
            ) : (
                harSøktMinstEnGang && !lasterVirksomhetsoversiktListe &&
                <BodyShort>Søket ga ingen resultater</BodyShort>
            )}
            <div>
                {lasterVirksomhetsoversiktListe && (
                    <Loader
                        title={"Henter sykefraværsstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                )}
                {virksomhetsoversiktListeFeil && (
                    <BodyShort>
                        Noe gikk galt under uthenting av sykefraværsstatistikk
                    </BodyShort>
                )}
            </div>
        </SideContainer>
    );
};

const loggSøkPåFylkeIAmplitude = (filtervisningstate: FiltervisningState, filterverdier: Filterverdier) => {
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

const loggSøkMedFilterIAmplitude = (filtervisningstate: FiltervisningState) => {
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
        },]

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

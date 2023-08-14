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
    if (filtervisningstate.valgtFylke) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.FYLKE,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.kommuner.length) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.KOMMUNE,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.iaStatus) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.STATUS,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.sektor) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.SEKTOR,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.bransjeprogram.length) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.BRANSJE,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.næringsgrupper.length) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.NÆRINGSGRUPPE,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.eiere?.length) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.EIER,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.sykefraværsprosent.fra > 0) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.SYKEFRAVÆR_FRA,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.sykefraværsprosent.til < 100) {
        loggFilterverdiKategorier(
            FilterverdiKategorier.SYKEFRAVÆR_TIL,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.antallArbeidsforhold.fra != 5) {
        console.log("Antall arbeidsforhold fra: ", filtervisningstate.antallArbeidsforhold.fra)
        loggFilterverdiKategorier(
            FilterverdiKategorier.ARBEIDSFORHOLD_FRA,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }

    if (filtervisningstate.antallArbeidsforhold.til) {
        console.log("Antall arbeidsforhold til: ", filtervisningstate.antallArbeidsforhold.til)
        loggFilterverdiKategorier(
            FilterverdiKategorier.ARBEIDSFORHOLD_TIL,
            "sykefraversstatistikk",
            Søkekomponenter.PRIORITERING
        )
    }
}

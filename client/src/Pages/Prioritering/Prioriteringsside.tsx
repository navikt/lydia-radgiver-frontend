import { useEffect, useState } from "react";
import { BodyShort, Loader, SortState } from "@navikt/ds-react";
import { Filtervisning } from "./Filter/Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import {
    useHentAntallTreff,
} from "../../api/lydia-api/sok";
import { useHentVirksomhetsoversiktListe } from "../../api/lydia-api/sok";
import { useFilterverdier } from "../../api/lydia-api/sok";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import {
    sammenliknFilterverdier,
    useFiltervisningState,
} from "./Filter/filtervisning-reducer";
import { Virksomhetsoversikt } from "../../domenetyper/virksomhetsoversikt";
import { loggSideLastet, Søkekomponenter } from "../../util/analytics-klient";
import { loggSøkMedFilterIAnalytics } from "./loggSøkMedFilterIAnalytics";
import SideContainer from "../../components/SideContainer";

export const ANTALL_RESULTATER_PER_SIDE = 100;

export const Prioriteringsside = () => {
    useTittel(statiskeSidetitler.prioriteringsside);

    const [sortering, setSortering] = useState<SortState>({
        direction: "descending",
        orderBy: "tapte_dagsverk",
    });

    const [skalSøke, setSkalSøke] = useState(false);
    const [virksomhetsoversiktListe, setVirksomhetsoversiktListe] =
        useState<Virksomhetsoversikt[]>();
    const [totaltAntallTreff, setTotaltAntallTreff] = useState<number>();
    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const { data: filterverdier } = useFilterverdier();
    const filtervisning = useFiltervisningState();
    const harSøktMinstEnGang = virksomhetsoversiktListe !== undefined;
    const fantResultaterISøk =
        harSøktMinstEnGang && virksomhetsoversiktListe.length > 0;
    const [gammelFilterState, setGammelFilterState] = useState(
        filtervisning.state,
    );

    const {
        data: virksomhetsoversiktListeRespons,
        loading: lasterVirksomhetsoversiktListe,
        error: virksomhetsoversiktListeFeil,
        validating: validererVirksomhetsoversiktListe,
    } = useHentVirksomhetsoversiktListe({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });

    const skalViseTabell =
        fantResultaterISøk && !lasterVirksomhetsoversiktListe;

    const { data: antallTreff } = useHentAntallTreff({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });

    const stoppSøkingOmViHarFåttSvarPåAlt = () => {
        if (virksomhetsoversiktListeRespons && antallTreff !== undefined) {
            setSkalSøke(false);
        }
    };

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
            stoppSøkingOmViHarFåttSvarPåAlt();
        }
    }, [virksomhetsoversiktListeRespons]);

    useEffect(() => {
        if (antallTreff !== undefined) {
            setTotaltAntallTreff(antallTreff);
            stoppSøkingOmViHarFåttSvarPåAlt();
        }
    }, [antallTreff]);

    function oppdaterSide(side: number, sortering?: SortState) {
        loggSøkMedFilterIAnalytics(
            filtervisning.state,
            Søkekomponenter.PRIORITERING,
        );
        setVirksomhetsoversiktListe(undefined);

        filtervisning.oppdaterSide({
            side,
            sortering,
        });
        setSkalSøke(true);
    }

    const harEndringIFilterverdi = sammenliknFilterverdier(
        gammelFilterState,
        filtervisning.state,
    );
    const [autosøktimer, setAutosøktimer] = useState<
        NodeJS.Timeout | undefined
    >();

    useEffect(() => {
        if (
            !harEndringIFilterverdi &&
            !skalSøke &&
            filtervisning.state.autosøk
        ) {
            const gammelSide = gammelFilterState.side;
            setGammelFilterState(filtervisning.state);
            clearTimeout(autosøktimer);
            setAutosøktimer(
                setTimeout(() => {
                    setVirksomhetsoversiktListe(undefined);

                    if (gammelSide === filtervisning.state.side) {
                        filtervisning.oppdaterSide({
                            side: 1,
                        });
                    }
                    setSkalSøke(true);
                }, 500),
            );
        }
    }, [harEndringIFilterverdi, skalSøke, filtervisning.state.autosøk]);

    return (
        <SideContainer>
            <Filtervisning
                filtervisning={filtervisning}
                laster={
                    validererVirksomhetsoversiktListe ||
                    lasterVirksomhetsoversiktListe
                }
                søkPåNytt={() => {
                    setTotaltAntallTreff(undefined);
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
                harSøktMinstEnGang &&
                !lasterVirksomhetsoversiktListe && (
                    <BodyShort>Søket ga ingen resultater</BodyShort>
                )
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

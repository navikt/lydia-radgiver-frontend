import { useEffect, useState } from "react";
import { BodyShort, Loader, SortState } from "@navikt/ds-react";
import { Filtervisning } from "./Filter/Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import { useFilterverdier, useHentAntallTreff, useHentVirksomhetsoversiktListe, } from "../../api/lydia-api";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import { useFiltervisningState } from "./Filter/filtervisning-reducer";
import { Virksomhetsoversikt } from "../../domenetyper/virksomhetsoversikt";
import { SideContainer } from "../../styling/containere";
import { loggSideLastet } from "../../util/amplitude-klient";
import { loggSøkMedFilterIAmplitude } from "./amplitudeLoggingPrioriteringsside";

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
    const {data: filterverdier} = useFilterverdier();
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
    } = useHentAntallTreff({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });

    const stoppSøkingOmViHarFåttSvarPåAlt = () => {
        if (virksomhetsoversiktListeRespons && antallTreff !== undefined) {
            setSkalSøke(false);
        }
    }

    useEffect(() => {
        if (filterverdier && !filtervisningLoaded) {
            filtervisning.lastData({filterverdier});
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
        if (antallTreff !== undefined) {
            setTotaltAntallTreff(antallTreff);
            stoppSøkingOmViHarFåttSvarPåAlt()
        }
    }, [antallTreff]);

    function oppdaterSide(side: number, sortering?: SortState) {
        loggSøkMedFilterIAmplitude(filtervisning.state)

        setVirksomhetsoversiktListe(undefined)

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

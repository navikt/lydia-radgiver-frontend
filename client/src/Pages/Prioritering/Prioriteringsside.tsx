import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Loader, SortState } from "@navikt/ds-react";
import { Filtervisning } from "./Filter/Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import {
    useFilterverdier,
    useSykefraværsstatistikk,
} from "../../api/lydia-api";
import { Virksomhetsoversikt } from "../../domenetyper";
import { statiskeSidetitler, TittelContext } from "./TittelContext";
import { contentSpacing } from "../../styling/contentSpacing";
import { useFiltervisningState } from "./Filter/filtervisning-reducer";

const Container = styled.div`
    padding: ${contentSpacing.mobileY} 0;
`;

export const ANTALL_RESULTATER_PER_SIDE = 100;

const Prioriteringsside = () => {
    const { oppdaterTittel } = useContext(TittelContext);
    oppdaterTittel(statiskeSidetitler.prioriteringsside);

    const [sortering, setSortering] = useState<SortState>({
        direction: "descending",
        orderBy: "tapte_dagsverk",
    });

    const [sykefraværsstatistikk, setSykefraværsstatistikk] =
        useState<Virksomhetsoversikt[]>();
    const [skalSøke, setSkalSøke] = useState(false);
    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const harSøktMinstEnGang = sykefraværsstatistikk !== undefined;
    const fantResultaterISøk =
        harSøktMinstEnGang && sykefraværsstatistikk.length > 0;
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const { data: filterverdier } = useFilterverdier();
    const filtervisning = useFiltervisningState();
    const {
        data: sfStatistikkFraApi,
        error,
        loading,
        antallTreff: totaltAntallTreff,
    } = useSykefraværsstatistikk({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });
    useEffect(() => {
        if (filterverdier && !filtervisningLoaded) {
            filtervisning.lastData({ filterverdier });
            setFiltervisningLoaded(true);
        }
    });
    useEffect(() => {
        if (sfStatistikkFraApi) {
            setSykefraværsstatistikk(sfStatistikkFraApi.data);
            setSkalSøke(false);
        }
    }, [sfStatistikkFraApi]);

    function oppdaterSide(side: number, sortering?: SortState) {
        filtervisning.oppdaterSide({
            side,
            sortering,
        });
        setSkalSøke(true);
    }

    return (
        <Container>
            <Filtervisning
                filtervisning={filtervisning}
                søkPåNytt={() => {
                    oppdaterSide(1);
                }}
            />
            <br />
            {skalViseTabell ? (
                <PrioriteringsTabell
                    sykefraværsstatistikk={sykefraværsstatistikk}
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
                harSøktMinstEnGang && !loading && <SøketGaIngenResultater />
            )}
            <div style={{ textAlign: "center" }}>
                {loading && (
                    <Loader
                        title={"Henter sykefraværsstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                )}
                {error && (
                    <p>
                        {" "}
                        Noe gikk galt under uthenting av sykefraværsstatistikk
                    </p>
                )}
            </div>
        </Container>
    );
};

const SøketGaIngenResultater = () => (
    <p style={{ textAlign: "center" }}>Søket ga ingen resultater</p>
);

export default Prioriteringsside;

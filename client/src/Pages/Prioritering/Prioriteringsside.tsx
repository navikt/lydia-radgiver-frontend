import { useEffect, useState } from "react";
import styled from "styled-components";
import { BodyShort, Loader, SortState } from "@navikt/ds-react";
import { Filtervisning } from "./Filter/Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import { useFilterverdier, useHentVirksomhetsoversiktListe, } from "../../api/lydia-api";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import { contentSpacing } from "../../styling/contentSpacing";
import { useFiltervisningState } from "./Filter/filtervisning-reducer";
import { Virksomhetsoversikt } from "../../domenetyper/virksomhetsoversikt";

const Container = styled.div`
  padding: ${contentSpacing.mobileY} 0;
`;

export const ANTALL_RESULTATER_PER_SIDE = 100;

const Prioriteringsside = () => {
    useTittel(statiskeSidetitler.prioriteringsside);

    const [sortering, setSortering] = useState<SortState>({
        direction: "descending",
        orderBy: "tapte_dagsverk",
    });

    const [virksomhetsoversiktListe, setVirksomhetsoversiktListe] = useState<Virksomhetsoversikt[]>();
    const [skalSøke, setSkalSøke] = useState(false);
    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const harSøktMinstEnGang = virksomhetsoversiktListe !== undefined;
    const fantResultaterISøk = harSøktMinstEnGang && virksomhetsoversiktListe.length > 0;
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const { data: filterverdier } = useFilterverdier();
    const filtervisning = useFiltervisningState();
    const {
        data: virksomhetsoversiktResultatFraApi,
        error,
        loading,
        antallTreff: totaltAntallTreff,
    } = useHentVirksomhetsoversiktListe({
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
        if (virksomhetsoversiktResultatFraApi) {
            setVirksomhetsoversiktListe(virksomhetsoversiktResultatFraApi.data);
            setSkalSøke(false);
        }
    }, [virksomhetsoversiktResultatFraApi]);

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
                harSøktMinstEnGang && !loading && <BodyShort>Søket ga ingen resultater</BodyShort>
            )}
            <div>
                {loading && (
                    <Loader
                        title={"Henter sykefraværsstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                )}
                {error && (
                    <BodyShort>
                        Noe gikk galt under uthenting av sykefraværsstatistikk
                    </BodyShort>
                )}
            </div>
        </Container>
    );
};

export default Prioriteringsside;

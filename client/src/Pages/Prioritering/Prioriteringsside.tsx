import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Loader, SortState } from "@navikt/ds-react";
import { Filtervisning } from "./Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import { useFilterverdier, useSykefraværsstatistikk } from "../../api/lydia-api";
import { Filterverdier, Sorteringsverdi, SykefraversstatistikkVirksomhet, Søkeverdier } from "../../domenetyper";
import { statiskeSidetitler, TittelContext } from "./TittelContext";
import { contentSpacing } from "../../styling/contentSpacing";

const Container = styled.div`
  padding: ${contentSpacing.mobileY} 0;
`;

const tommeFilterverdier: Filterverdier = {
    fylker: [],
    neringsgrupper: [],
    sorteringsnokler: [],
    statuser: [],
    bransjeprogram: [],
    filtrerbareEiere: [],
};

const tilSorteringsretning = (direction: SortState["direction"] = "descending") => {

    switch (direction) {
        case "ascending":
            return "asc";
        case "descending":
            return "desc";
    }
}

export const ANTALL_RESULTATER_PER_SIDE = 100;

const Prioriteringsside = () => {
    const {oppdaterTittel} = useContext(TittelContext)
    oppdaterTittel(statiskeSidetitler.prioriteringsside)

    const [sortering, setSortering] = useState<SortState>({direction: "descending", orderBy: "tapte_dagsverk"})
    const [sykefraværsstatistikk, setSykefraværsstatistikk] = useState<SykefraversstatistikkVirksomhet[]>();
    const [side, setSide] = useState(1);
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>({
        side,
        antallArbeidsforholdRange: {
            fra: 5,
            til: NaN,
        }
    });
    const [skalSøke, setSkalSøke] = useState(false);
    const harSøktMinstEnGang = sykefraværsstatistikk !== undefined
    const fantResultaterISøk = harSøktMinstEnGang && sykefraværsstatistikk.length > 0
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const {data: filterverdier} = useFilterverdier();
    const {
        data: sfStatistikkFraApi,
        error,
        loading,
        antallTreff: totaltAntallTreff
    } = useSykefraværsstatistikk({
        søkeverdier,
        initierSøk: skalSøke,
    });
    useEffect(() => {
        if (sfStatistikkFraApi) {
            setSykefraværsstatistikk(sfStatistikkFraApi.data);
            setSkalSøke(false);
        }
    }, [sfStatistikkFraApi]);

    function oppdaterSide(side: number, sortering?: SortState) {
        setSide(side);
        setSøkeverdier({
            ...søkeverdier,
            side,
            ...(sortering && {
                sorteringsnokkel: sortering.orderBy as Sorteringsverdi,
                sorteringsretning: tilSorteringsretning(sortering.direction)
            })

        });
        setSkalSøke(true);
    }

    return (
        <Container>
            <Filtervisning
                filterverdier={filterverdier ?? tommeFilterverdier}
                oppdaterSøkeverdier={(nyeSøkeverdier: Søkeverdier) => {
                    setSøkeverdier({...søkeverdier, ...nyeSøkeverdier});
                    setSkalSøke(false);
                }}
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
                    endreSortering={(sortering => {
                        setSortering(sortering)
                        oppdaterSide(1, sortering)
                    })}
                    side={side}
                    totaltAntallTreff={totaltAntallTreff}
                />
            ) : harSøktMinstEnGang && !loading && <SøketGaIngenResultater />}
            <div style={{textAlign: "center"}}>
                {loading && (
                    <Loader
                        title={"Henter sykefraværsstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                )}
                {error && <p> Noe gikk galt under uthenting av sykefraværsstatistikk</p>}
            </div>
        </Container>
    );
};

const SøketGaIngenResultater = () => (
    <p style={{textAlign: "center"}}>Søket ga ingen resultater</p>
)

export default Prioriteringsside;

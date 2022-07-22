import {sorteringsverdier, StyledFiltervisning} from "./Filtervisning";
import { StyledPrioriteringsTabell } from "./PrioriteringsTabell";
import {
    useFilterverdier,
    useSykefraværsstatistikk,
} from "../../api/lydia-api";
import {useContext, useEffect, useState} from "react";
import {
    Filterverdier, Sorteringsverdi,
    SykefraversstatistikkVirksomhet,
    Søkeverdier,
} from "../../domenetyper";
import {Loader, SortState} from "@navikt/ds-react";
import {statiskeSidetitler, TittelContext} from "./TittelContext";

const tommeFilterverdier: Filterverdier = {
    fylker: [],
    neringsgrupper: [],
    sorteringsnokler: [],
    statuser: [],
    bransjeprogram: []
};

const tilSorteringsretning = (direction: "ascending" | "descending" = "descending") => {
    switch (direction) {
        case "ascending":
            return "asc";
        case "descending":
            return "desc";
    }
}

export const ANTALL_RESULTATER_PER_SIDE = 50;

export const totaltAntallResultaterTilAntallSider = (totaltAntallResultater: number, antallResultaterPerSide = ANTALL_RESULTATER_PER_SIDE) =>
    Math.ceil(totaltAntallResultater / antallResultaterPerSide)

const Prioriteringsside = () => {
    const {oppdaterTittel} = useContext(TittelContext)
    oppdaterTittel(statiskeSidetitler.prioriteringsside)

    const [sortering, setSortering] = useState<SortState>({ direction: "descending", orderBy: "tapte_dagsverk" })
    const [sykefraværsstatistikk, setSykefraværsstatistikk] = useState<SykefraversstatistikkVirksomhet[]>();
    const [totaltAntallResultaterISøk, setTotaltAntallResultaterISøk] = useState(0);
    const [side, setSide] = useState(1);
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>({
        side,
        antallArbeidsforholdRange: {
            fra: 5,
            til: NaN,
        },
        skalInkludereTotaltAntall: true
    });
    const [skalSøke, setSkalSøke] = useState(false);
    const [triggetNyttSøk, setTriggetNyttSøk] = useState(false)
    const harSøktMinstEnGang = sykefraværsstatistikk !== undefined
    const fantResultaterISøk = harSøktMinstEnGang && sykefraværsstatistikk.length > 0
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const { data: filterverdier } = useFilterverdier();
    const {
        data: sfStatistikkFraApi,
        error,
        loading,
    } = useSykefraværsstatistikk({
        søkeverdier,
        initierSøk: skalSøke,
    });
    useEffect(() => {
        if (sfStatistikkFraApi) {
            setSykefraværsstatistikk(sfStatistikkFraApi.data);
            if (triggetNyttSøk && sfStatistikkFraApi.total) {
                setTotaltAntallResultaterISøk(sfStatistikkFraApi.total)
            }
            setSkalSøke(false);
        }
    }, [sfStatistikkFraApi]);

    function oppdaterSide(side: number, triggetNyttSøk: boolean, sortering?: SortState) {
        setSide(side);
        setTriggetNyttSøk(triggetNyttSøk)
        setSøkeverdier({
            ...søkeverdier,
            side,
            skalInkludereTotaltAntall: triggetNyttSøk,
            sorteringsnokkel: sortering?.orderBy as Sorteringsverdi,
            sorteringsretning: tilSorteringsretning(sortering?.direction)
        });
        setSkalSøke(true);
    }

    return (
        <>
            <StyledFiltervisning
                filterverdier={filterverdier ?? tommeFilterverdier}
                oppdaterSøkeverdier={(nyeSøkeverdier: Søkeverdier) => {
                    setSøkeverdier({ ...søkeverdier, ...nyeSøkeverdier });
                    setSkalSøke(false);
                }}
                søkPåNytt={() => {
                    oppdaterSide(1, true);
                }}
            />
            <br />
            {skalViseTabell ? (
                <StyledPrioriteringsTabell
                    sykefraværsstatistikk={sykefraværsstatistikk}
                    endreSide={(side) => {
                        oppdaterSide(side, false);
                    }}
                    sortering={sortering}
                    endreSortering={(sortering => {
                        setSortering(sortering)
                        oppdaterSide(1, true, sortering)
                    })}
                    totaltAntallResultaterISøk={totaltAntallResultaterISøk}
                    side={side}
                />
            ) : harSøktMinstEnGang && !loading && <SøketGaIngenResultater />}
            <div style={{ textAlign: "center" }}>
                {loading && (
                    <Loader
                        title={"Henter sykefraværsstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                )}
                {error && <p> Noe gikk galt under uthenting av sykefraværsstatistikk</p>}
            </div>
        </>
    );
};

const SøketGaIngenResultater = () => (
    <p style={{ textAlign : "center"}}>Søket ga ingen resultater</p>
)

export default Prioriteringsside;

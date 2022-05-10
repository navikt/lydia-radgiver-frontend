import { StyledFiltervisning } from "./Filtervisning";
import { StyledPrioriteringsTabell } from "./PrioriteringsTabell";
import {
    useFilterverdier,
    useSykefraværsstatistikk,
} from "../../api/lydia-api";
import { useEffect, useState } from "react";
import {
    Filterverdier,
    SykefraversstatistikkVirksomhet,
    Søkeverdier,
} from "../../domenetyper";
import { Loader } from "@navikt/ds-react";

const tommeFilterverdier: Filterverdier = {
    fylker: [],
    neringsgrupper: [],
    sorteringsnokler: [],
    statuser: [],
};

const Prioriteringsside = () => {
    const [sykefraværsstatistikk, setSykefraværsstatistikk] = useState<SykefraversstatistikkVirksomhet[]>();
    const [antallSider, setAntallSider] = useState(0);
    const [side, setSide] = useState(1);
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>({
        side,
        antallAnsatteRange: {
            fra: 5,
            til: NaN,
        },
    });
    const [skalSøke, setSkalSøke] = useState(false);
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
            setAntallSider(Math.round(sfStatistikkFraApi.total / 50));
            setSkalSøke(false);
        }
    }, [sfStatistikkFraApi]);

    function oppdaterSide(side: number) {
        setSide(side);
        setSøkeverdier({
            ...søkeverdier,
            side,
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
                    oppdaterSide(1);
                }}
            />
            <br />
            {skalViseTabell ? (
                <StyledPrioriteringsTabell
                    sykefraværsstatistikk={sykefraværsstatistikk}
                    endreSide={(side) => {
                        oppdaterSide(side);
                    }}
                    antallSider={antallSider}
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

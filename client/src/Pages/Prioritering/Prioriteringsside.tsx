import { StyledFiltervisning } from "./Filtervisning";
import { StyledPrioriteringsTabell } from "./PrioriteringsTabell";
import {
    useFilterverdier,
    useSykefraværsstatistikk,
} from "../../api/lydia-api";
import {useContext, useEffect, useState} from "react";
import {
    Filterverdier,
    SykefraversstatistikkVirksomhet,
    Søkeverdier,
} from "../../domenetyper";
import { Loader } from "@navikt/ds-react";
import {statiskeSidetitler, TittelContext} from "./TittelContext";

const tommeFilterverdier: Filterverdier = {
    fylker: [],
    neringsgrupper: [],
    sorteringsnokler: [],
    statuser: [],
    bransjeprogram: []
};

export const ANTALL_RESULTATER_PER_SIDE = 50;

export const totaltAntallResultaterTilAntallSider = (totaltAntallResultater: number, antallResultaterPerSide = ANTALL_RESULTATER_PER_SIDE) =>
    Math.ceil(totaltAntallResultater / antallResultaterPerSide)

const Prioriteringsside = () => {
    const {oppdaterTittel} = useContext(TittelContext)
    oppdaterTittel(statiskeSidetitler.prioriteringsside)

    const [sykefraværsstatistikk, setSykefraværsstatistikk] = useState<SykefraversstatistikkVirksomhet[]>();
    const [totaltAntallResultaterISøk, setTotaltAntallResultaterISøk] = useState(0);
    const [side, setSide] = useState(1);
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>({
        side,
        antallArbeidsforholdRange: {
            fra: 5,
            til: NaN,
        },
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

    function oppdaterSide(side: number) {
        setSide(side);
        setSøkeverdier({
            ...søkeverdier,
            side,
        });
        setSkalSøke(true);
    }

    /**
     * Henter bare totalt antall når vi faktisk gjør et nytt søk
     *
     * */
    function inkluderTotaltAntall(triggetNyttSøk: boolean) {
        console.log('nå skal det legges ved totalt antall til', triggetNyttSøk)
        setTriggetNyttSøk(triggetNyttSøk)
        setSøkeverdier(prev => ({
            ...prev,
            skalInkludereTotaltAntall: triggetNyttSøk
        }))
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
                    inkluderTotaltAntall(true)
                    oppdaterSide(1);
                }}
            />
            <br />
            {skalViseTabell ? (
                <StyledPrioriteringsTabell
                    sykefraværsstatistikk={sykefraværsstatistikk}
                    endreSide={(side) => {
                        inkluderTotaltAntall(false)
                        oppdaterSide(side);
                    }}
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

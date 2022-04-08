import { StyledFiltervisning } from "./Filtervisning";
import { StyledPrioriteringsTabell} from "./PrioriteringsTabell";
import {
  useFilterverdier,
  useSykefraværsstatistikk,
} from "../../api/lydia-api";
import {useEffect, useState} from "react";
import {
    Søkeverdier,
    Filterverdier,
    SykefraversstatistikkVirksomhet,
} from "../../domenetyper";
import {Loader} from "@navikt/ds-react";

const tommeFilterverdier: Filterverdier = {
    fylker: [],
    neringsgrupper: [],
    sorteringsnokler: [],
    statuser: []
};
const tomSykefraværsstatistikk: SykefraversstatistikkVirksomhet[] = [];

const Prioriteringsside = () => {
    const [sykefraværsstatistikk, setSykefraværsstatistikk] = useState(tomSykefraværsstatistikk)
    const [antallSider, setAntallSider] = useState(0)
    const [side, setSide] = useState(1)
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>({ side });
    const [skalSøke, setSkalSøke] = useState(false);
    const skalViseTabell = sykefraværsstatistikk && !skalSøke

    const {
        data: filterverdier,
    } = useFilterverdier();
    const {
        data: sfStatistikkFraApi,
        error,
    } = useSykefraværsstatistikk({ søkeverdier, initierSøk: skalSøke });
    useEffect(() => {
        if (sfStatistikkFraApi) {
            setSykefraværsstatistikk(sfStatistikkFraApi.data)
            setAntallSider(Math.round(sfStatistikkFraApi.total / 50))
            setSkalSøke(false)
        }
    }, [sfStatistikkFraApi])

    function oppdaterSide(side: number) {
        setSide(side)
        setSøkeverdier({
            ...søkeverdier, side
        })
        setSkalSøke(true)
    }

    return (
        <>
            <StyledFiltervisning
                filterverdier={filterverdier ?? tommeFilterverdier}
                oppdaterSøkeverdier={(nyeSøkeverdier: Søkeverdier) => {
                    setSøkeverdier({ ...søkeverdier, ...nyeSøkeverdier });
                    setSkalSøke(false)
                }}
                søkPåNytt={() => {
                    oppdaterSide(1)
                }}
            />
            <br />
            {skalViseTabell && <StyledPrioriteringsTabell
                sykefraværsstatistikk={
                    sykefraværsstatistikk
                }
                endreSide={(side) => {
                    oppdaterSide(side);
                }}
                antallSider={antallSider}
                side={side}
            />}
            <div style={{ textAlign : "center"}}>
                {skalSøke &&
                    <Loader
                        title={"Henter sykefraværsstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                }
                {error && <p>Noe gikk galt under uthenting av sykefraværsstatistikk</p>}
            </div>
        </>
    );
};

export default Prioriteringsside;

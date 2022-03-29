import Filtervisning from "./Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
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

const tommeFilterverdier: Filterverdier = {
    fylker: [],
    neringsgrupper: [],
    sorteringsnokler: [],
    statuser: []
};
const tomSykefraværsstatistikk: SykefraversstatistikkVirksomhet[] = [];


const Prioriteringsside = () => {
    const [sykefraværsstatistikk, setSykefraværsstatistikk] = useState(tomSykefraværsstatistikk)
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>();
    const [skalSøke, setSkalSøke] = useState(false);
    const skalViseTabell = sykefraværsstatistikk && !skalSøke;

    const {
        data: filterverdier,
    } = useFilterverdier();
    const {
        data: sfStatistikkFraApi,
        error,
    } = useSykefraværsstatistikk({ søkeverdier, initierSøk: skalSøke });
    useEffect(() => {
        if (sfStatistikkFraApi) {
            setSykefraværsstatistikk(sfStatistikkFraApi)
            setSkalSøke(false)
        }
    }, [sfStatistikkFraApi])

    return (
        <>
            <Filtervisning
                filterverdier={filterverdier ?? tommeFilterverdier}
                oppdaterSøkeverdier={(nyeSøkeverdier: Søkeverdier) => {
                    setSøkeverdier({ ...søkeverdier, ...nyeSøkeverdier });
                    setSkalSøke(false)
                }}
                søkPåNytt={() => setSkalSøke(true)}
            />
            <br />
            {skalViseTabell && <PrioriteringsTabell
                sykefraværsstatistikk={
                    sykefraværsstatistikk
                }
            />}
            {skalSøke && <p>Loading...</p>}
            {error && <p>Error</p>}
        </>
    );
};

export default Prioriteringsside;

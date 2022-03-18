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
};
const tomSykefraværsstatistikk: SykefraversstatistikkVirksomhet[] = [];


const Prioriteringsside = () => {
    const [sykefraværsstatistikk, setSykefraværsstatistikk] = useState(tomSykefraværsstatistikk)
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>();
    const [skalSøke, setSkalSøke] = useState(false);
    const {
        data: filterverdier,
    } = useFilterverdier();
    const {
        data: sfStatistikkFraApi,
        loading,
        error,
    } = useSykefraværsstatistikk({ søkeverdier, initierSøk: skalSøke });
    useEffect(() => {
        if (sfStatistikkFraApi) {
            setSykefraværsstatistikk(sfStatistikkFraApi)
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
            {sykefraværsstatistikk && <PrioriteringsTabell
                sykefraværsstatistikk={
                    sykefraværsstatistikk
                }
            />}
            {loading && <p>Loading</p>}
            {error && <p>Error</p>}
        </>
    );
};

export default Prioriteringsside;

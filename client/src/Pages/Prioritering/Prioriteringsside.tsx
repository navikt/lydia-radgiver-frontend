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

const Prioriteringsside = () => {
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>();
    const [skalSøke, setSkalSøke] = useState(false);
    const {
        data: filterverdier,
        loading: loadingFilterverdier,
        error: errorFilterverdier,
    } = useFilterverdier();
    const {
        data: sykefraversstatistikk,
        loading: loadingSykefraværsstatistikk,
        error: errorSykefraværsstatistikk,
    } = useSykefraværsstatistikk({ søkeverdier, initierSøk: skalSøke });

    useEffect(() => {
        if (skalSøke) {
            setSkalSøke(false);
        }
    }, [skalSøke]);

    const isLoading = loadingFilterverdier && !errorFilterverdier || loadingSykefraværsstatistikk && !errorSykefraværsstatistikk;
    const isError = errorFilterverdier || errorSykefraværsstatistikk;

    const tommeFilterverdier: Filterverdier = {
        fylker: [],
        neringsgrupper: [],
        sorteringsnokler: [],
    };
    const tomSykefraværsstatistikk: SykefraversstatistikkVirksomhet[] = [];

    return (
        <>
            <Filtervisning
                filterverdier={filterverdier ?? tommeFilterverdier}
                oppdaterSøkeverdier={(nyeSøkeverdier: Søkeverdier) => {
                    setSøkeverdier({ ...søkeverdier, ...nyeSøkeverdier });
                }}
                søkPåNytt={() => setSkalSøke(true)}
            />
            <br />
            <PrioriteringsTabell
                sykefraværsstatistikk={
                    sykefraversstatistikk ?? tomSykefraværsstatistikk
                }
            />
            {isLoading && <p>Loading</p>}
            {isError && <p>Error</p>}
        </>
    );
};

export default Prioriteringsside;

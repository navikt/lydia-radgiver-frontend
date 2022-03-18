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
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>();
    const [skalSøke, setSkalSøke] = useState(false);
    const {
        data: filterverdier,
    } = useFilterverdier();
    const {
        data: sykefraversstatistikk,
        loading,
        error,
    } = useSykefraværsstatistikk({ søkeverdier, initierSøk: skalSøke });


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
            {sykefraversstatistikk && <PrioriteringsTabell
                sykefraværsstatistikk={
                    sykefraversstatistikk
                }
            />}
            {loading && <p>Loading</p>}
            {error && <p>Error</p>}
        </>
    );
};

export default Prioriteringsside;

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
  const [skalSøke, setSkalSøke] = useState(false)
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
      setSkalSøke(false)
    }
  }, [skalSøke])

  const isLoading = loadingFilterverdier || loadingSykefraværsstatistikk;
  const isError = errorFilterverdier || errorSykefraværsstatistikk;

  const gjørNyttSøk = (nyeSøkeverdier: Søkeverdier) => {
    setSøkeverdier({ ...søkeverdier, ...nyeSøkeverdier });
  };
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
        oppdaterSøkeverdier={gjørNyttSøk}
      />
      <PrioriteringsTabell
        sykefraværsstatistikk={
          sykefraversstatistikk ?? tomSykefraværsstatistikk
        }
      />
      <button onClick={() => {setSkalSøke(true)}}>Søk</button>
      {isLoading && <p>Loading</p>}
      {isError && <p>Error</p>}
    </>
  );
};

export default Prioriteringsside;

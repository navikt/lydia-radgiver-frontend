import Filtervisning from "./Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import { Søkeverdier, useFilterverdier, useSykefraværsstatistikk } from "../../api/lydia-api";
import { useState } from "react";
import { Filterverdier } from "../../domenetyper";

const Prioriteringsside = () => {
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>();
    const {
        data: filterverdier,
        loading: loadingFilterverdier,
        error: errorFilterverdier,
    } = useFilterverdier();
    const {
        data: sykefraversstatistikk,
        loading: loadingSykefraværsstatistikk,
        error: errorSykefraværsstatistikk,
    } = useSykefraværsstatistikk(søkeverdier);

    const isLoading = loadingFilterverdier || loadingSykefraværsstatistikk;
    const isError = errorFilterverdier || errorSykefraværsstatistikk;
    
    const gjørNyttSøk = (nyeSøkeverdier: Søkeverdier) => {
        setSøkeverdier({...søkeverdier, ...nyeSøkeverdier});
    }
    const tommeFilterverdier : Filterverdier  = { fylker : [] }

    return (
        <>
            <Filtervisning filterverdier={filterverdier ?? tommeFilterverdier} oppdaterSøkeverdier={gjørNyttSøk} />
            {/* TODO: erstatt mock med verdien fra useSykefraværsstatistikk */}
            <PrioriteringsTabell sykefraværsstatistikk={sykefraversstatistikk ?? []} />
            {isLoading && <p>Loading</p>}
            {isError && <p>Error</p>}
        </>
    );
};


export default Prioriteringsside;

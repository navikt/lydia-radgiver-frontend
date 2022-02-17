import Filtervisning from "./Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import { useFilterverdier, useSykefraværsstatistikk } from "../../api/lydia-api";

const Prioriteringsside = () => {
    const {
        data: filterverdier,
        loading: loadingFilterverdier,
        error: errorFilterverdier,
    } = useFilterverdier();
    const {
        data: sykefraversstatistikk,
        loading: loadingSykefraværsstatistikk,
        error: errorSykefraværsstatistikk,
    } = useSykefraværsstatistikk();

    const isLoading = loadingFilterverdier || loadingSykefraværsstatistikk;
    const isError = errorFilterverdier || errorSykefraværsstatistikk;

    return (
        <>
            {filterverdier && <Filtervisning {...filterverdier} />}
            {/* TODO: erstatt mock med verdien fra useSykefraværsstatistikk */}
            <PrioriteringsTabell sykefraværsstatistikk={sykefraversstatistikk ?? []} />
            {isLoading && <p>Loading</p>}
            {isError && <p>Error</p>}
        </>
    );
};

export default Prioriteringsside;

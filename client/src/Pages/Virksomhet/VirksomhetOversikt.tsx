import { IASak, Sakshistorikk, SykefraversstatistikkVirksomhet, Virksomhet, } from "../../domenetyper";
import { StyledSamarbeidshistorikk } from "./IASakshendelserOversikt";
import { VirksomhetHeader } from "./VirksomhetHeader";

interface VirksomhetOversiktProps {
    virksomhet: Virksomhet;
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet;
    iaSak?: IASak;
    samarbeidshistorikk: Sakshistorikk[];
    muterState?: () => void;
}

export const VirksomhetOversikt = ({
    virksomhet,
    sykefraværsstatistikk,
    iaSak,
    samarbeidshistorikk,
    muterState,
}: VirksomhetOversiktProps) => {
    return (
        <>
            <VirksomhetHeader
                virksomhet={virksomhet}
                sykefraværsstatistikk={sykefraværsstatistikk}
                iaSak={iaSak}
                muterState={muterState}
            />
            <br />
            <StyledSamarbeidshistorikk samarbeidshistorikk={samarbeidshistorikk} />
        </>
    );
};

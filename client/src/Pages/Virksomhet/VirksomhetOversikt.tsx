import styled from "styled-components";
import { IASak, Sakshistorikk, SykefraversstatistikkVirksomhet, Virksomhet, } from "../../domenetyper";
import { StyledSamarbeidshistorikk } from "./IASakshendelserOversikt";
import { VirksomhetHeader } from "./VirksomhetHeader";
import { contentSpacing } from "../../styling/contentSpacing";

const Container = styled.div`
  padding-top: ${contentSpacing.mobileY};
`;

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
        <Container>
            <VirksomhetHeader
                virksomhet={virksomhet}
                sykefraværsstatistikk={sykefraværsstatistikk}
                iaSak={iaSak}
                muterState={muterState}
            />
            <br />
            <StyledSamarbeidshistorikk samarbeidshistorikk={samarbeidshistorikk} />
        </Container>
    );
};

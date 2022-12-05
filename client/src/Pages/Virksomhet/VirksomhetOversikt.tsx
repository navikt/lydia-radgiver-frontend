import styled from "styled-components";
import { IASak, Sakshistorikk, Virksomhet, } from "../../domenetyper";
import { Samarbeidshistorikk } from "./Samarbeidshistorikk";
import { VirksomhetHeader } from "./VirksomhetHeader";
import { contentSpacing } from "../../styling/contentSpacing";

const Container = styled.div`
  padding-top: ${contentSpacing.mobileY};
`;

interface VirksomhetOversiktProps {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    samarbeidshistorikk: Sakshistorikk[];
    muterState?: () => void;
}

export const VirksomhetOversikt = ({virksomhet, iaSak, samarbeidshistorikk, muterState}: VirksomhetOversiktProps) => {
    return (
        <Container>
            <VirksomhetHeader virksomhet={virksomhet} iaSak={iaSak} muterState={muterState} />
            <br />
            <Samarbeidshistorikk samarbeidshistorikk={samarbeidshistorikk} />
        </Container>
    );
};

import styled from "styled-components";
import { Tabs } from "@navikt/ds-react";
import { IASak, Sakshistorikk, Virksomhet, } from "../../domenetyper";
import { Samarbeidshistorikk } from "./Samarbeidshistorikk/Samarbeidshistorikk";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt/Virksomhetsoversikt";
import { contentSpacing, strekkBakgrunnenHeltUtTilKantenAvSida } from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";

const Container = styled.div`
  padding-top: ${contentSpacing.mobileY};

  background-color: ${NavFarger.white};
  ${strekkBakgrunnenHeltUtTilKantenAvSida}
`;

const StyledPanel = styled(Tabs.Panel)`
  padding-top: 1.5rem;
  
  background-color: ${NavFarger.gray100};
  ${strekkBakgrunnenHeltUtTilKantenAvSida}
`;

interface Props {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    samarbeidshistorikk: Sakshistorikk[];
    muterState?: () => void;
}

export const VirksomhetsVisning = ({ virksomhet, iaSak, samarbeidshistorikk, muterState }: Props) => {
    return (
        <Container>
            <Virksomhetsoversikt virksomhet={virksomhet} iaSak={iaSak} muterState={muterState} />
            <br />
            <Tabs defaultValue="samarbeidshistorikk">
                <Tabs.List style={{width: "100%"}}>
                    <Tabs.Tab value="samarbeidshistorikk" label="Samarbeidshistorikk" />
                </Tabs.List>
                <StyledPanel value="samarbeidshistorikk">
                    <Samarbeidshistorikk samarbeidshistorikk={samarbeidshistorikk} />
                </StyledPanel>
            </Tabs>
        </Container>
    );
};

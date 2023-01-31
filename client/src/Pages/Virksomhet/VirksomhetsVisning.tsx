import styled from "styled-components";
import { Tabs } from "@navikt/ds-react";
import { IASak, Sakshistorikk,  } from "../../domenetyper/domenetyper";
import { Samarbeidshistorikk } from "./Samarbeidshistorikk/Samarbeidshistorikk";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt/Virksomhetsoversikt";
import { contentSpacing, strekkBakgrunnenHeltUtTilKantenAvSida } from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";
import { ViBistårTab } from "./ViBistårTab/ViBistårTab";
import { Virksomhet } from "../../domenetyper/virksomhet";

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
    // Dette er ein wannabe feature toggle
    const visViBistårTab = false; // TODO: Dobbeltsjekk at verdien her er 'false' før du pusher

    return (
        <Container>
            <Virksomhetsoversikt virksomhet={virksomhet} iaSak={iaSak} muterState={muterState} />
            <br />
            <Tabs defaultValue="samarbeidshistorikk">
                <Tabs.List style={{width: "100%"}}>
                    <Tabs.Tab value="samarbeidshistorikk" label="Samarbeidshistorikk" />
                    {visViBistårTab && <Tabs.Tab value="vi-bistår" label="Vi bistår" />}
                </Tabs.List>
                <StyledPanel value="samarbeidshistorikk">
                    <Samarbeidshistorikk samarbeidshistorikk={samarbeidshistorikk} />
                </StyledPanel>
                <StyledPanel value="vi-bistår">
                    {visViBistårTab && <ViBistårTab />}
                </StyledPanel>
            </Tabs>
        </Container>
    );
};

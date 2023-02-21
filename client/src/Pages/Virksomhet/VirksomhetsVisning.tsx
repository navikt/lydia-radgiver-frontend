import styled from "styled-components";
import { Tabs } from "@navikt/ds-react";
import { Samarbeidshistorikk } from "./Samarbeidshistorikk/Samarbeidshistorikk";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt/Virksomhetsoversikt";
import { contentSpacing, strekkBakgrunnenHeltUtTilKantenAvSida } from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";
import { ViBistårTab } from "./ViBistårTab/ViBistårTab";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { useHentAktivSakForVirksomhet } from "../../api/lydia-api";

const Container = styled.div`
  padding-top: ${contentSpacing.mobileY};

  background-color: ${NavFarger.white};
  ${strekkBakgrunnenHeltUtTilKantenAvSida}
`;

const StyledPanel = styled(Tabs.Panel)`
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  
  background-color: ${NavFarger.gray100};
  ${strekkBakgrunnenHeltUtTilKantenAvSida}
`;

interface Props {
    virksomhet: Virksomhet;
}

export const VirksomhetsVisning = ({ virksomhet }: Props) => {
    // TODO: Fjern denne for prodsetting
    const visViBistårTab = erIDev;

    const {
        data: iaSak
    } = useHentAktivSakForVirksomhet(virksomhet.orgnr)

    return (
        <Container>
            <Virksomhetsoversikt virksomhet={virksomhet} iaSak={iaSak} />
            <br />
            <Tabs defaultValue="samarbeidshistorikk">
                <Tabs.List style={{width: "100%"}}>
                    <Tabs.Tab value="samarbeidshistorikk" label="Samarbeidshistorikk" />
                    {visViBistårTab && iaSak && <Tabs.Tab value="vi-bistår" label="Vi bistår" />}
                </Tabs.List>
                <StyledPanel value="samarbeidshistorikk">
                    <Samarbeidshistorikk orgnr={virksomhet.orgnr}/>
                </StyledPanel>
                <StyledPanel value="vi-bistår">
                    {visViBistårTab && iaSak && <ViBistårTab iaSak={iaSak}/>}
                </StyledPanel>
            </Tabs>
        </Container>
    );
};

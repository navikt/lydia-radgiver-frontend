import styled from "styled-components";
import { Tabs } from "@navikt/ds-react";
import { SamarbeidshistorikkFane } from "./Samarbeidshistorikk/SamarbeidshistorikkFane";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt/Virksomhetsoversikt";
import { contentSpacing, strekkBakgrunnenHeltUtTilKantenAvSida } from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";
import { LeveranseFane } from "./Leveranser/LeveranseFane";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentAktivSakForVirksomhet, useHentHistoriskstatistikk } from "../../api/lydia-api";
import { HistoriskstatistikkFane } from "./Historiskstatistikk/HistoriskstatistikkFane";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { StatistikkFane } from "./Statistikk/StatistikkFane";

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
    const {
        data: iaSak
    } = useHentAktivSakForVirksomhet(virksomhet.orgnr)

    const {
        data: statistikk
    } = useHentHistoriskstatistikk(virksomhet.orgnr)

    return (
        <Container>
            <Virksomhetsoversikt virksomhet={virksomhet} iaSak={iaSak} />
            <br />
            <Tabs defaultValue="statistikk">
                <Tabs.List style={{ width: "100%" }}>
                    <Tabs.Tab value="statistikk" label="Statistikk" />
                    {erIDev && <Tabs.Tab value="historiskstatistikk" label="Historisk statistikk" />}
                    <Tabs.Tab value="samarbeidshistorikk" label="Samarbeidshistorikk" />
                    {iaSak && <Tabs.Tab value="ia-tjenester" label="IA-tjenester" />}
                </Tabs.List>
                <StyledPanel value="statistikk">
                    <StatistikkFane virksomhet={virksomhet}/>
                </StyledPanel>
                <StyledPanel value="historiskstatistikk">
                    {statistikk &&
                        <HistoriskstatistikkFane historiskStatistikk={statistikk} />}
                </StyledPanel>
                <StyledPanel value="samarbeidshistorikk">
                    <SamarbeidshistorikkFane orgnr={virksomhet.orgnr} />
                </StyledPanel>
                <StyledPanel value="ia-tjenester">
                    {iaSak && <LeveranseFane iaSak={iaSak} />}
                </StyledPanel>
            </Tabs>
        </Container>
    );
};

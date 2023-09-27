import styled from "styled-components";
import { Tabs } from "@navikt/ds-react";
import { Samarbeidshistorikk } from "./Samarbeidshistorikk/Samarbeidshistorikk";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt/Virksomhetsoversikt";
import { contentSpacing, strekkBakgrunnenHeltUtTilKantenAvSida } from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";
import { Leveranser } from "./Leveranser/Leveranser";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentAktivSakForVirksomhet, useHentHistoriskstatistikk } from "../../api/lydia-api";
import { Historiskstatistikk } from "./Historiskstatistikk/Historiskstatistikk";
import { erIDev } from "../../components/Dekoratør/Dekoratør";

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
            <Tabs defaultValue="samarbeidshistorikk">
                <Tabs.List style={{ width: "100%" }}>
                    <Tabs.Tab value="samarbeidshistorikk" label="Samarbeidshistorikk" />
                    {iaSak && <Tabs.Tab value="ia-tjenester" label="IA-tjenester" />}
                    {erIDev && <Tabs.Tab value="historiskstatistikk" label="Historisk statistikk" />}
                </Tabs.List>
                <StyledPanel value="samarbeidshistorikk">
                    <Samarbeidshistorikk orgnr={virksomhet.orgnr} />
                </StyledPanel>
                <StyledPanel value="ia-tjenester">
                    {iaSak && <Leveranser iaSak={iaSak} />}
                </StyledPanel>
                <StyledPanel value="historiskstatistikk">
                    {statistikk &&
                        <Historiskstatistikk historiskStatistikk={statistikk} />}
                </StyledPanel>
            </Tabs>
        </Container>
    );
};

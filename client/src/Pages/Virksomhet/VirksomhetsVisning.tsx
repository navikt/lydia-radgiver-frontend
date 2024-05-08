import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@navikt/ds-react";
import { SamarbeidshistorikkFane } from "./Samarbeidshistorikk/SamarbeidshistorikkFane";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt/Virksomhetsoversikt";
import {
    contentSpacing,
    strekkBakgrunnenHeltUtTilKantenAvSida,
} from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";
import { LeveranseFane } from "./Leveranser/LeveranseFane";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentAktivSakForVirksomhet } from "../../api/lydia-api";
import { StatistikkFane } from "./Statistikk/StatistikkFane";
import { KartleggingFane } from "./Kartlegging/KartleggingFane";

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
    const { data: iaSak, loading: lasterIaSak } = useHentAktivSakForVirksomhet(
        virksomhet.orgnr,
    );

    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "statistikk";

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        setSearchParams(searchParams, { replace: true });
    };

    React.useEffect(() => {
        const ikkeGyldigTab =
            fane !== "statistikk" &&
            fane !== "samarbeidshistorikk" &&
            fane !== "kartlegging" &&
            fane !== "ia-tjenester";
        const manglerIaSak = fane === "ia-tjenester" && !iaSak && !lasterIaSak;

        if (ikkeGyldigTab || manglerIaSak) {
            oppdaterTabISearchParam("statistikk");
        }
    }, [lasterIaSak]);

    return (
        <Container>
            <Virksomhetsoversikt virksomhet={virksomhet} iaSak={iaSak} />
            <br />
            <Tabs
                value={fane}
                onChange={oppdaterTabISearchParam}
                defaultValue="statistikk"
            >
                <Tabs.List style={{ width: "100%" }}>
                    <Tabs.Tab value="statistikk" label="Statistikk" />
                    {iaSak && (
                        <Tabs.Tab value="kartlegging" label="Kartlegging" />
                    )}
                    {iaSak && (
                        <Tabs.Tab value="ia-tjenester" label="IA-tjenester" />
                    )}
                    <Tabs.Tab
                        value="historikk"
                        label="Historikk"
                    />
                </Tabs.List>
                <StyledPanel value="statistikk">
                    <StatistikkFane virksomhet={virksomhet} />
                </StyledPanel>
                <StyledPanel value="kartlegging">
                    {iaSak && <KartleggingFane iaSak={iaSak} />}
                </StyledPanel>
                <StyledPanel value="ia-tjenester">
                    {iaSak && <LeveranseFane iaSak={iaSak} />}
                </StyledPanel>
                <StyledPanel value="historikk">
                    <SamarbeidshistorikkFane orgnr={virksomhet.orgnr} />
                </StyledPanel>
            </Tabs>
        </Container>
    );
};

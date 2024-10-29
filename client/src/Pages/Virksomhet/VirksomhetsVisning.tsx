import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@navikt/ds-react";
import { SamarbeidshistorikkFane } from "./Samarbeidshistorikk/SamarbeidshistorikkFane";
import {
    contentSpacing,
    strekkBakgrunnenHeltUtTilKantenAvSida,
} from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentAktivSakForVirksomhet } from "../../api/lydia-api/virksomhet";
import { StatistikkFane } from "./Statistikk/StatistikkFane";
import VirksomhetContext from "./VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "./Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";
import { LeveranseFane } from "./Leveranser/LeveranseFane";

const Container = styled.div`
    padding-top: ${contentSpacing.mobileY};

    background-color: ${NavFarger.white};
    ${strekkBakgrunnenHeltUtTilKantenAvSida}; // Velger å sette denne, da heading bruker xlarge, selv om vi setter dem til å være large.
    --a-font-size-heading-xlarge: 1.75rem;
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
    const [visKonfetti, setVisKonfetti] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "statistikk";

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        setSearchParams(searchParams, { replace: true });
    };

    React.useEffect(() => {
        if (fane !== "statistikk" && fane !== "historikk") {
            oppdaterTabISearchParam("statistikk");
        }
    }, [lasterIaSak]);

    return (
        <VirksomhetContext.Provider
            value={{
                virksomhet,
                iaSak,
                lasterIaSak,
                fane,
                setFane: oppdaterTabISearchParam,
                spørreundersøkelseId: null,
                setVisKonfetti,
                visKonfetti,
            }}
        >
            <Container>
                <VirksomhetOgSamarbeidsHeader
                    virksomhet={virksomhet}
                    iaSak={iaSak}
                />
                <br />
                <Tabs
                    value={fane}
                    onChange={oppdaterTabISearchParam}
                    defaultValue="statistikk"
                >
                    <Tabs.List style={{ width: "100%" }}>
                        <Tabs.Tab value="statistikk" label="Statistikk" />
                        <Tabs.Tab value="historikk" label="Historikk" />
                        <Tabs.Tab value="ia-tjenester" label="IA-tjenester" />
                    </Tabs.List>
                    <StyledPanel value="statistikk">
                        <StatistikkFane virksomhet={virksomhet} />
                    </StyledPanel>
                    <StyledPanel value="historikk">
                        <SamarbeidshistorikkFane orgnr={virksomhet.orgnr} />
                    </StyledPanel>
                    <StyledPanel value="ia-tjenester">
                        {iaSak && <LeveranseFane iaSak={iaSak} />}
                    </StyledPanel>
                </Tabs>
            </Container>
        </VirksomhetContext.Provider>
    );
};

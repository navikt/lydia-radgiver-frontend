import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { Alert, Heading, Tabs } from "@navikt/ds-react";
import { SakshistorikkFane } from "./Sakshistorikk/SakshistorikkFane";
import {
    contentSpacing,
    strekkBakgrunnenHeltUtTilKantenAvSida,
} from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentSakForVirksomhet } from "../../api/lydia-api/virksomhet";
import { SykefraværsstatistikkFane } from "./Statistikk/SykefraværsstatistikkFane";
import VirksomhetContext from "./VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "./Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";

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

const Banner = styled(Alert)`
    margin-bottom: 1rem;
`;

interface Props {
    virksomhet: Virksomhet;
}

export const VirksomhetsVisning = ({ virksomhet }: Props) => {
    const { data: iaSak, loading: lasterIaSak } = useHentSakForVirksomhet(
        virksomhet.orgnr,
        virksomhet.aktivtSaksnummer ?? undefined,
    );
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
                        <Tabs.Tab
                            value="statistikk"
                            label="Sykefraværsstatistikk"
                        />
                        <Tabs.Tab value="historikk" label="Historikk" />
                    </Tabs.List>
                    <StyledPanel value="statistikk">
                        <NyeKoderBanner />
                        <SykefraværsstatistikkFane virksomhet={virksomhet} />
                    </StyledPanel>
                    <StyledPanel value="historikk">
                        <SakshistorikkFane orgnr={virksomhet.orgnr} />
                    </StyledPanel>
                </Tabs>
            </Container>
        </VirksomhetContext.Provider>
    );
};

function NyeKoderBanner() {
    const [visBanner, setVisBanner] = React.useState(true);

    if (!visBanner) {
        return null;
    }

    return (
        <Banner variant="info" closeButton onClose={() => setVisBanner(false)} contentMaxWidth={false}>
            <Heading size="xsmall">
                Nye næringskoder fra 1. september
            </Heading>
            <p>
                Brønnøysundregistrene har tatt i bruk nye næringskoder som kan påvirke hvilken bransje eller næring virksomheten tilhører. Virksomheter som blir påvirket kan   derfor få nye sammenligningstall med bransjens/næringens sykefravær.
            </p>
        </Banner>
    );
}
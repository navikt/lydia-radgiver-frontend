import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { HStack, Tabs } from "@navikt/ds-react";
import { SamarbeidshistorikkFane } from "./Samarbeidshistorikk/SamarbeidshistorikkFane";
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
import PlanFane from "./Plan/PlanFane";
import { AdministrerIaProsesser } from "./Prosesser/AdministrerIaProsesser";
import VirksomhetContext from "./VirksomhetContext";
import NyVirksomhetsoversikt from "./Virksomhetsoversikt/VirksomhetsinfoHeader";

const Container = styled.div`
    padding-top: ${contentSpacing.mobileY};

    background-color: ${NavFarger.white};
    ${strekkBakgrunnenHeltUtTilKantenAvSida}

    // Velger å sette denne, da heading bruker xlarge, selv om vi setter dem til å være large.
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

export const NyVirksomhetsVisning = ({ virksomhet }: Props) => {
    const { data: iaSak, loading: lasterIaSak } = useHentAktivSakForVirksomhet(
        virksomhet.orgnr,
    );
    const [visKonfetti, setVisKonfetti] = React.useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const kartleggingId = searchParams.get("kartleggingId");
    const fane = searchParams.get("fane") ?? "statistikk";

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        setSearchParams(searchParams, { replace: true });
    };

    React.useEffect(() => {
        const ikkeGyldigTab =
            fane !== "statistikk" &&
            fane !== "historikk" &&
            fane !== "kartlegging" &&
            fane !== "plan" &&
            fane !== "ia-tjenester";
        const manglerIaSak = fane === "ia-tjenester" && !iaSak && !lasterIaSak;

        if (ikkeGyldigTab || manglerIaSak) {
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
                kartleggingId,
                setVisKonfetti,
                visKonfetti,
            }}
        >
            <Container>
                <NyVirksomhetsoversikt />
                <br />
                <HStack gap="4">
                    {iaSak && (
                        <AdministrerIaProsesser
                            orgnummer={virksomhet.orgnr}
                            iaSak={iaSak}
                        />
                    )}
                </HStack>
                <Tabs
                    value={fane}
                    onChange={oppdaterTabISearchParam}
                    defaultValue="statistikk"
                >
                    <Tabs.List style={{ width: "100%" }}>
                        {/*<Tabs.Tab value="statistikk" label="Statistikk" />*/}
                        {iaSak && (
                            <Tabs.Tab value="kartlegging" label="Kartlegging" />
                        )}
                        {iaSak && <Tabs.Tab value="plan" label="Plan" />}
                        {iaSak && (
                            <Tabs.Tab
                                value="ia-tjenester"
                                label="IA-tjenester"
                            />
                        )}
                        {/*<Tabs.Tab value="historikk" label="Historikk" />*/}
                    </Tabs.List>
                    <StyledPanel value="statistikk">
                        <StatistikkFane virksomhet={virksomhet} />
                    </StyledPanel>
                    <StyledPanel value="kartlegging">
                        {iaSak && (
                            <KartleggingFane
                                iaSak={iaSak}
                                KartleggingIdFraUrl={kartleggingId}
                            />
                        )}
                    </StyledPanel>
                    <StyledPanel value="ia-tjenester">
                        {iaSak && <LeveranseFane iaSak={iaSak} />}
                    </StyledPanel>
                    <StyledPanel value="plan">
                        {iaSak && <PlanFane iaSak={iaSak} />}
                    </StyledPanel>
                    <StyledPanel value="historikk">
                        <SamarbeidshistorikkFane orgnr={virksomhet.orgnr} />
                    </StyledPanel>
                </Tabs>
            </Container>
        </VirksomhetContext.Provider>
    );
};
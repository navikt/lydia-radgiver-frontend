import React from "react";
import styled from "styled-components";
import {
    contentSpacing,
    strekkBakgrunnenHeltUtTilKantenAvSida,
} from "../../../styling/contentSpacing";
import { NavFarger } from "../../../styling/farger";
import { Spacer, Tabs } from "@navikt/ds-react";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { useSearchParams } from "react-router-dom";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import SamarbeidsplanFane from "../Plan/SamarbeidsplanFane";
import { IASak } from "../../../domenetyper/domenetyper";
import EvalueringFane from "./Evaluering/EvalueringFane";
import { BehovsvurderingFane } from "../Kartlegging/BehovsvurderingFane";
import VirksomhetContext from "../VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "../Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";
import { loggNavigertTilNyTab } from "../../../util/amplitude-klient";
import { SamarbeidProvider } from "./SamarbeidContext";
import { EksternLenke } from "../../../components/EksternLenke";
import { useHentSalesforceSamarbeidLenke } from "../../../api/lydia-api/virksomhet";

const StyledPanel = styled(Tabs.Panel)`
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;

    background-color: ${NavFarger.gray100};
    ${strekkBakgrunnenHeltUtTilKantenAvSida}
`;

const Container = styled.div`
    padding-top: ${contentSpacing.mobileY};

    background-color: ${NavFarger.white};
    ${strekkBakgrunnenHeltUtTilKantenAvSida}; // Velger å sette denne, da heading bruker xlarge, selv om vi setter dem til å være large.
    --a-font-size-heading-xlarge: 1.75rem;
`;

export const SamarbeidsVisning = ({
    alleSamarbeid,
    iaSak,
    virksomhet,
    gjeldendeProsessId,
    lasterIaSak,
}: {
    alleSamarbeid: IaSakProsess[];
    virksomhet: Virksomhet;
    iaSak: IASak;
    gjeldendeProsessId: number;
    lasterIaSak: boolean;
}) => {
    const gjeldendeSamarbeid = alleSamarbeid.find(
        (samarbeid) => samarbeid.id == gjeldendeProsessId,
    );

    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "behovsvurdering";
    const spørreundersøkelseId = searchParams.get("kartleggingId");
    const { data: salesforceSamarbeidsLenke } = useHentSalesforceSamarbeidLenke(
        gjeldendeSamarbeid?.id,
    );

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        loggNavigertTilNyTab(tab);
        setSearchParams(searchParams, { replace: true });
    };

    React.useEffect(() => {
        if (
            fane !== "behovsvurdering" &&
            fane !== "plan" &&
            fane !== "evaluering" &&
            fane !== "ia-tjenester"
        ) {
            oppdaterTabISearchParam("behovsvurdering");
        }
    }, []);

    if (gjeldendeSamarbeid === undefined) {
        location.href = `/virksomhet/${iaSak.orgnr}`;
        return null;
    }

    return (
        <VirksomhetContext.Provider
            value={{
                virksomhet,
                iaSak,
                lasterIaSak,
                fane,
                setFane: oppdaterTabISearchParam,
                spørreundersøkelseId: spørreundersøkelseId,
            }}
        >
            <SamarbeidProvider samarbeid={gjeldendeSamarbeid}>
                {gjeldendeSamarbeid && (
                    <Container>
                        <VirksomhetOgSamarbeidsHeader
                            virksomhet={virksomhet}
                            iaSak={iaSak}
                            gjeldendeSamarbeid={gjeldendeSamarbeid}
                        />
                        <br />
                        <Tabs
                            value={fane}
                            onChange={oppdaterTabISearchParam}
                            defaultValue="behovsvurdering"
                        >
                            <Tabs.List style={{ width: "100%" }}>
                                {iaSak && (
                                    <Tabs.Tab
                                        value="behovsvurdering"
                                        label="Behovsvurdering"
                                    />
                                )}
                                {iaSak && (
                                    <Tabs.Tab
                                        value="plan"
                                        label="Samarbeidsplan"
                                    />
                                )}
                                {iaSak && (
                                    <Tabs.Tab
                                        value="evaluering"
                                        label="Evaluering"
                                    />
                                )}
                                {iaSak && salesforceSamarbeidsLenke && (
                                    <>
                                        <Spacer />
                                        <EksternLenke
                                            href={
                                                salesforceSamarbeidsLenke.salesforceLenke
                                            }
                                        >
                                            Salesforce - samarbeid
                                        </EksternLenke>
                                    </>
                                )}
                            </Tabs.List>
                            <StyledPanel value="behovsvurdering">
                                {iaSak && (
                                    <BehovsvurderingFane
                                        iaSak={iaSak}
                                        gjeldendeSamarbeid={gjeldendeSamarbeid}
                                    />
                                )}
                            </StyledPanel>
                            <StyledPanel value="plan">
                                {iaSak && (
                                    <SamarbeidsplanFane
                                        iaSak={iaSak}
                                        samarbeid={gjeldendeSamarbeid}
                                    />
                                )}
                            </StyledPanel>
                            <StyledPanel value="evaluering">
                                {iaSak && (
                                    <EvalueringFane
                                        iaSak={iaSak}
                                        gjeldendeSamarbeid={gjeldendeSamarbeid}
                                    />
                                )}
                            </StyledPanel>
                        </Tabs>
                    </Container>
                )}
            </SamarbeidProvider>
        </VirksomhetContext.Provider>
    );
};

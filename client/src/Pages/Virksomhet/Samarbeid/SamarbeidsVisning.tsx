import React from "react";
import styled from "styled-components";
import {
    contentSpacing,
    strekkBakgrunnenHeltUtTilKantenAvSida,
} from "../../../styling/contentSpacing";
import { NavFarger } from "../../../styling/farger";
import { Tabs } from "@navikt/ds-react";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { useSearchParams } from "react-router-dom";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import SamarbeidsplanFane from "../Plan/SamarbeidsplanFane";
import { IASak } from "../../../domenetyper/domenetyper";
import EvalueringFane from "./Evaluering/EvalueringFane";
import { BehovsvurderingFane } from "../Kartlegging/BehovsvurderingFane";
import VirksomhetContext from "../VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "../Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";

const StyledPanel = styled(Tabs.Panel)`
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;

    background-color: ${NavFarger.gray100};
    ${strekkBakgrunnenHeltUtTilKantenAvSida}
`;

const Container = styled.div`
    padding-top: ${contentSpacing.mobileY};

    background-color: ${NavFarger.white};
    ${strekkBakgrunnenHeltUtTilKantenAvSida} // Velger å sette denne, da heading bruker xlarge, selv om vi setter dem til å være large.
    --a-font-size-heading-xlarge: 1.75rem;
`;

export const SamarbeidsVisning = ({
    alleSamarbeid,
    iaSak,
    virksomhet,
    gjeldendeProsessId,
}: {
    alleSamarbeid: IaSakProsess[];
    virksomhet: Virksomhet;
    iaSak: IASak;
    gjeldendeProsessId: number;
}) => {
    const gjeldendeSamarbeid = alleSamarbeid.find(
        (samarbeid) => samarbeid.id == gjeldendeProsessId,
    );
    const [visKonfetti, setVisKonfetti] = React.useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "behovsvurdering";
    const kartleggingId = searchParams.get("kartleggingId");

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        setSearchParams(searchParams, { replace: true });
    };
    const lasterIaSak = false;

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

    if (gjeldendeSamarbeid === undefined)
        location.href = `/virksomhet/${iaSak.orgnr}`;

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
                                <Tabs.Tab value="plan" label="Samarbeidsplan" />
                            )}
                            {iaSak && (
                                <Tabs.Tab
                                    value="evaluering"
                                    label="Evaluering"
                                />
                            )}
                        </Tabs.List>
                        <StyledPanel value="behovsvurdering">
                            {iaSak && (
                                <BehovsvurderingFane
                                    iaSak={iaSak}
                                    gjeldendeSamarbeid={gjeldendeSamarbeid}
                                    KartleggingIdFraUrl={null} //TODO: Sett til noe fra context før prod
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
                            {iaSak && <EvalueringFane />}
                        </StyledPanel>
                    </Tabs>
                </Container>
            )}
        </VirksomhetContext.Provider>
    );
};

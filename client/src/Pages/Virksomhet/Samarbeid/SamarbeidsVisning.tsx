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
import { KartleggingFane } from "../Kartlegging/KartleggingFane";
import { LeveranseFane } from "../Leveranser/LeveranseFane";
import PlanFane from "../Plan/PlanFane";

import SamarbeidsContext from "./SamarbeidsContext";
import { IASak } from "../../../domenetyper/domenetyper";
import { Samarbeidsoversikt } from "./Samarbeidsoversikt";
import EvalueringFane from "./Evaluering/EvalueringFane";

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
    virksomhet,
    iaProsesser,
    iaSak,
    gjeldendeProsessId,
}: {
    iaProsesser: IaSakProsess[];
    virksomhet: Virksomhet;
    iaSak: IASak;
    gjeldendeProsessId: number;
}) => {
    const iaProsess = iaProsesser.find(
        (prosess) => prosess.id == gjeldendeProsessId,
    );

    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "behovsvurdering";

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
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

    return (
        iaProsess && (
            <SamarbeidsContext.Provider
                value={{
                    virksomhet,
                    iaSak,
                    iaProsesser,
                    gjeldendeProsessId,
                }}
            >
                <Container>
                    <Samarbeidsoversikt />
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
                            {iaSak && <Tabs.Tab value="plan" label="Plan" />}
                            {iaSak && (
                                <Tabs.Tab
                                    value="evaluering"
                                    label="Evaluering"
                                />
                            )}
                            {iaSak && (
                                <Tabs.Tab
                                    value="ia-tjenester"
                                    label="IA-tjenester"
                                />
                            )}
                        </Tabs.List>
                        <StyledPanel value="behovsvurdering">
                            {iaSak && (
                                <KartleggingFane
                                    iaSak={iaSak}
                                    KartleggingIdFraUrl={null}
                                />
                            )}
                        </StyledPanel>
                        <StyledPanel value="plan">
                            {iaSak && <PlanFane iaSak={iaSak} />}
                        </StyledPanel>
                        <StyledPanel value="evaluering">
                            {iaSak && <EvalueringFane />}
                        </StyledPanel>
                        <StyledPanel value="ia-tjenester">
                            {iaSak && <LeveranseFane iaSak={iaSak} />}
                        </StyledPanel>
                    </Tabs>
                </Container>
            </SamarbeidsContext.Provider>
        )
    );
};

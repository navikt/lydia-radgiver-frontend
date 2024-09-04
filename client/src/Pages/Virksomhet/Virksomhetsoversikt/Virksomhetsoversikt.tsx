import styled from "styled-components";
import { Heading } from "@navikt/ds-react";
import { IASakOversikt } from "./IASakStatus/IASakOversikt";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { contentSpacing } from "../../../styling/contentSpacing";
import { BrregStatus } from "./BrregStatus";
import React from "react";
import VirksomhetContext, { VirksomhetContextType } from "../VirksomhetContext";

const OversiktsContainer = styled.div`
    display: flex;
    flex-direction: column;

    padding-bottom: ${contentSpacing.mobileY};
`;

const VirksomhetsnavnContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;

    span {
        margin-bottom: 0.25rem;
        margin-top: 0.25rem;
    }
`;

const VirksomhetsinfoContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
`;

export const Virksomhetsoversikt = () => {
    const { virksomhet, iaSak } = React.useContext(
        VirksomhetContext,
    ) as VirksomhetContextType;

    return (
        <OversiktsContainer>
            <VirksomhetsnavnContainer>
                <Heading level={"2"} size={"large"}>
                    {virksomhet.navn}
                </Heading>
                <BrregStatus status={virksomhet.status} />
            </VirksomhetsnavnContainer>
            <VirksomhetsinfoContainer>
                <VirksomhetInformasjon virksomhet={virksomhet} />
                <IASakOversikt iaSak={iaSak} orgnummer={virksomhet.orgnr} />
            </VirksomhetsinfoContainer>
        </OversiktsContainer>
    );
};

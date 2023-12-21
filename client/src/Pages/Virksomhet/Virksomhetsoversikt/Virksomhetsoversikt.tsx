import styled from "styled-components";
import { Heading } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { IASakOversikt } from "./IASakStatus/IASakOversikt";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { contentSpacing } from "../../../styling/contentSpacing";
import { BrregStatus } from "./BrregStatus";
import { Virksomhet } from "../../../domenetyper/virksomhet";

const OversiktsContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding-bottom: ${contentSpacing.mobileY};
`;

const VirksomhetsnavnContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const VirksomhetsinfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`

interface Props {
    virksomhet: Virksomhet;
    iaSak?: IASak;
}

export const Virksomhetsoversikt = ({ virksomhet, iaSak }: Props) => (
    <OversiktsContainer>
        <VirksomhetsnavnContainer>
            <Heading level={"2"} size={"large"}>{virksomhet.navn}</Heading>
            <BrregStatus status={virksomhet.status} />
        </VirksomhetsnavnContainer>
        <VirksomhetsinfoContainer>
            <VirksomhetInformasjon virksomhet={virksomhet} />
            <IASakOversikt iaSak={iaSak} orgnummer={virksomhet.orgnr} />
        </VirksomhetsinfoContainer>
    </OversiktsContainer>
)

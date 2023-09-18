import styled from "styled-components";
import { Heading } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { Sykefraværsstatistikk } from "./Statistikk/Sykefraværsstatistikk";
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

const InnholdContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const VirksomhetsinfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  gap: 1rem;
  min-width: 20rem;
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
        <InnholdContainer>
            <VirksomhetsinfoContainer>
                <VirksomhetInformasjon virksomhet={virksomhet} />
                <Sykefraværsstatistikk orgnummer={virksomhet.orgnr} bransje={virksomhet.bransje} />
            </VirksomhetsinfoContainer>
            <IASakOversikt iaSak={iaSak} orgnummer={virksomhet.orgnr} />
        </InnholdContainer>
    </OversiktsContainer>
)

import styled from "styled-components";
import { Heading } from "@navikt/ds-react";
import { IASak, Virksomhet } from "../../../domenetyper";
import { Sykefraværsstatistikk } from "./Statistikk/Sykefraværsstatistikk";
import { IASakOversikt } from "./IASakStatus/IASakOversikt";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { desktopAndUp, largeDesktopAndUp } from "../../../styling/breakpoint";
import { contentSpacing } from "../../../styling/contentSpacing";
import { NavFarger } from "../../../styling/farger";
import { BrregStatus } from "./BrregStatus";

const OversiktsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${NavFarger.white};

  // Gjer at bakgrunnsgfargen dekkjer heile breidda/høgda av skjermen
  margin-top: -${contentSpacing.mobileY};
  padding-top: ${contentSpacing.mobileY};
  padding-bottom: ${contentSpacing.mobileY};

  margin-left: -${contentSpacing.mobileX};
  margin-right: -${contentSpacing.mobileX};
  padding-left: ${contentSpacing.mobileX};
  padding-right: ${contentSpacing.mobileX};

  ${desktopAndUp} {
    margin-left: -${contentSpacing.desktopX};
    margin-right: -${contentSpacing.desktopX};
    padding-left: ${contentSpacing.desktopX};
    padding-right: ${contentSpacing.desktopX};
  }

  ${largeDesktopAndUp} {
    margin-left: -${contentSpacing.largeDesktopX};
    margin-right: -${contentSpacing.largeDesktopX};
    padding-left: ${contentSpacing.largeDesktopX};
    padding-right: ${contentSpacing.largeDesktopX};
  }
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
    muterState?: () => void;
}

export const Virksomhetsoversikt = ({ virksomhet, iaSak, muterState }: Props) => (
    <OversiktsContainer>
        <VirksomhetsnavnContainer>
            <Heading level={"2"} size={"large"}>{virksomhet.navn}</Heading>
            <BrregStatus status={virksomhet.status} />
        </VirksomhetsnavnContainer>
        <InnholdContainer>
            <VirksomhetsinfoContainer>
                <VirksomhetInformasjon virksomhet={virksomhet} />
                <Sykefraværsstatistikk orgnummer={virksomhet.orgnr} />
            </VirksomhetsinfoContainer>
            <IASakOversikt iaSak={iaSak} orgnummer={virksomhet.orgnr} muterState={muterState} />
        </InnholdContainer>
    </OversiktsContainer>
)

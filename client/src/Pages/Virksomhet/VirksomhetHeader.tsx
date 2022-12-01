import styled from "styled-components";
import { Heading, Tag } from "@navikt/ds-react";
import { IASak, SykefraversstatistikkVirksomhet, Virksomhet, VirksomhetStatusEnum } from "../../domenetyper";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";
import { IASakOversikt } from "./IASakOversikt";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { desktopAndUp, largeDesktopAndUp } from "../../styling/breakpoint";
import { contentSpacing } from "../../styling/contentSpacing";
import { NavFarger } from "../../styling/farger";

const HeaderContainer = styled.div`
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

const OverskriftContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const SlettetFjernetInfo = styled(Tag)`
  align-self: center;
  text-transform: lowercase;
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
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet;
    iaSak?: IASak;
    muterState?: () => void;
}

export const VirksomhetHeader = ({virksomhet, sykefraværsstatistikk, iaSak, muterState}: Props) => (
    <HeaderContainer>
        <OverskriftContainer>
            <Heading level={"2"} size={"large"}>{virksomhet.navn}</Heading>
            {
                (virksomhet.status == VirksomhetStatusEnum.enum.FJERNET
                    || virksomhet.status == VirksomhetStatusEnum.enum.SLETTET)
                && <SlettetFjernetInfo variant={"neutral"} size={"medium"}>
                    {virksomhet.status}
                </SlettetFjernetInfo>
            }
        </OverskriftContainer>
        <InnholdContainer>
            <VirksomhetsinfoContainer>
                <VirksomhetInformasjon virksomhet={virksomhet} />
                <SykefraværsstatistikkVirksomhet sykefraværsstatistikk={sykefraværsstatistikk} />
            </VirksomhetsinfoContainer>
            <IASakOversikt iaSak={iaSak} orgnummer={virksomhet.orgnr} muterState={muterState} />
        </InnholdContainer>
    </HeaderContainer>
)

import styled from "styled-components";
import { Heading, Tag } from "@navikt/ds-react";
import { IASak, SykefraversstatistikkVirksomhet, Virksomhet, VirksomhetStatusEnum } from "../../domenetyper";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";
import { IASakOversikt } from "./IASakOversikt";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { Breakpoint, forLargerThan } from "../../styling/breakpoint";
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

  ${forLargerThan(Breakpoint.Tablet)} {
    margin-left: -${contentSpacing.tabletX};
    margin-right: -${contentSpacing.tabletX};
    padding-left: ${contentSpacing.tabletX};
    padding-right: ${contentSpacing.tabletX};
  }

  ${forLargerThan(Breakpoint.LargeDesktop)} {
    margin-left: -${contentSpacing.desktopX};
    margin-right: -${contentSpacing.desktopX};
    padding-left: ${contentSpacing.desktopX};
    padding-right: ${contentSpacing.desktopX};
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
  background: ${NavFarger.gray200};
  border-color: ${NavFarger.borderMuted};
`;

const InnholdContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: row;
`;

const VirksomhetsinfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  gap: 1rem;
`

interface Props {
    virksomhet: Virksomhet;
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet;
    iaSak?: IASak;
    muterState?: () => void;
}

export const VirksomhetHeader = ({virksomhet, sykefraværsstatistikk, iaSak, muterState}: Props) => {
    return (
        <HeaderContainer>
            <OverskriftContainer>
                <Heading level={"2"} size={"large"}>
                    {virksomhet.navn}
                </Heading>
                {
                    (virksomhet.status == VirksomhetStatusEnum.enum.FJERNET
                        || virksomhet.status == VirksomhetStatusEnum.enum.SLETTET)
                    && <SlettetFjernetInfo variant={"warning"} size={"medium"}>
                        {virksomhet.status}
                    </SlettetFjernetInfo>
                }
            </OverskriftContainer>
            <InnholdContainer>
                <VirksomhetsinfoContainer>
                    <VirksomhetInformasjon virksomhet={virksomhet} />
                    <SykefraværsstatistikkVirksomhet
                        sykefraværsstatistikk={sykefraværsstatistikk}
                    />
                </VirksomhetsinfoContainer>
                <IASakOversikt
                    iaSak={iaSak}
                    orgnummer={virksomhet.orgnr}
                    muterState={muterState}
                />
            </InnholdContainer>
        </HeaderContainer>
    )
}

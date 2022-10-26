import styled from "styled-components";
import { Detail, Heading, Tag } from "@navikt/ds-react";
import { IASak, SykefraversstatistikkVirksomhet, Virksomhet, VirksomhetStatusEnum } from "../../domenetyper";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";
import { IASakOversikt } from "./IASakOversikt";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";
import { Breakpoint, forLargerThan } from "../../styling/breakpoint";
import { contentSpacing } from "../../styling/contentSpacing";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--navds-global-color-white);

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

const SektorInfo = styled(Detail)`
  color: var(--navds-global-color-gray-600);
  margin-left: auto;
`;

const SlettetFjernetInfo = styled(Tag)`
  align-self: center;
  text-transform: lowercase;
  background: var(--navds-global-color-gray-200);
  border-color: var(--navds-global-color-gray-500);
`;

const InnholdContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: row;
  border-top: 1px solid var(--navds-global-color-gray-300);
`;

const VirksomhetsinfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`

const StyledVirksomhetsInformasjon = styled(VirksomhetInformasjon)`
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

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
                {
                    virksomhet.sektor && (
                        <SektorInfo size={"medium"}>
                            Sektor: {virksomhet.sektor}
                        </SektorInfo>)
                }
            </OverskriftContainer>
            <InnholdContainer>
                <VirksomhetsinfoContainer>
                    <StyledVirksomhetsInformasjon virksomhet={virksomhet} />
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

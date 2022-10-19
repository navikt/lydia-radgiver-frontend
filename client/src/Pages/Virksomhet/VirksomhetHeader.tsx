import styled from "styled-components";
import { Detail, Heading, Tag } from "@navikt/ds-react";
import { IASak, SykefraversstatistikkVirksomhet, Virksomhet, VirksomhetStatusEnum } from "../../domenetyper";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";
import { IASakOversikt } from "./IASakOversikt";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OverskriftContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const SektorInfo = styled(Detail)`
  color: #707070;
  margin-left: auto;
`;

const SlettetFjernetInfo = styled(Tag)`
  align-self: center;
  text-transform: lowercase;
  background: #E5E5E5;
  border-color: #8F8F8F;
`;

const InnholdContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: row;
  border-top: 1px solid black;
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

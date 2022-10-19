import { Detail, Heading, Tag } from "@navikt/ds-react";
import { IASak, SykefraversstatistikkVirksomhet, Virksomhet, VirksomhetStatusEnum } from "../../domenetyper";
import { SykefraværsstatistikkVirksomhet } from "./SykefraværsstatistikkVirksomhet";
import { IASakOversikt } from "./IASakOversikt";
import styled from "styled-components";
import { VirksomhetInformasjon } from "./VirksomhetInformasjon";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const HorisontalFlexMedToppRamme = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: row;
  border-top: 1px solid black;
`;

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
        <Container>
            <div style={{display: "flex", alignItems: "flex-end", flexDirection: "row"}}>
                    <span style={{flex: "3", display: "flex", flexDirection: "row"}}>
                        <Heading level={"2"} size={"large"}>
                            {virksomhet.navn}
                        </Heading>
                        {
                            (virksomhet.status == VirksomhetStatusEnum.enum.FJERNET
                                || virksomhet.status == VirksomhetStatusEnum.enum.SLETTET)
                            && <Tag variant={"warning"}
                                    size={"medium"}
                                    style={{
                                        marginLeft: "1rem", alignSelf: "center", textTransform: "lowercase",
                                        background: "#E5E5E5",
                                        borderColor: "#8F8F8F"
                                    }}>
                                {virksomhet.status}
                            </Tag>
                        }
                    </span>
                {
                    virksomhet.sektor && (
                        <Detail size={"medium"} style={{color: "#707070", flex: "1"}}>
                            Sektor: {virksomhet.sektor}
                        </Detail>)
                }

            </div>
            <HorisontalFlexMedToppRamme>
                <Container style={{flex: 3}}>
                    <StyledVirksomhetsInformasjon virksomhet={virksomhet} />
                    <SykefraværsstatistikkVirksomhet
                        sykefraværsstatistikk={sykefraværsstatistikk}
                    />
                </Container>
                <IASakOversikt
                    iaSak={iaSak}
                    orgnummer={virksomhet.orgnr}
                    muterState={muterState}
                />
            </HorisontalFlexMedToppRamme>
        </Container>
    )
}
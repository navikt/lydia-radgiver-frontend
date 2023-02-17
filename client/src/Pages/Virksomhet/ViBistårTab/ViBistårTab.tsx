import { BodyShort, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { NyIALeveranseSkjema } from "./NyIALeveranseSkjema";
import { NavFarger } from "../../../styling/farger";
import { BorderRadius } from "../../../styling/borderRadius";
import { Skygger } from "../../../styling/skygger";
import { LeveranseOversikt } from "./LeveranseOversikt";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  background: ${NavFarger.white};
  padding: 0.75rem 1.5rem 1.5rem;
  border-radius: ${BorderRadius.medium};
  box-shadow: ${Skygger.small};
`;

const BeskjedTilBrukere = styled(BodyShort)`
  background: ${NavFarger.red300};
`;

interface Props {
    iaSak: IASak;
}

export const ViBistårTab = ({ iaSak }: Props) => {

    return (
        <Container>
            <div>
                <Heading size="large">Leveranser</Heading>
                <BodyShort>Her kan du legge leveranser når du bistår i saken.</BodyShort>
                <BeskjedTilBrukere>Denne modulen er under utvikling og skal ikke være synlig for brukere enda.</BeskjedTilBrukere>
                <BeskjedTilBrukere>Om du kan se denne modulen ta kontakt med team Pia :)</BeskjedTilBrukere>
            </div>
            <LeveranseOversikt iaSak={iaSak}/>
            {iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR &&
                <NyIALeveranseSkjema iaSak={iaSak} />
            }
        </Container>
    )
}

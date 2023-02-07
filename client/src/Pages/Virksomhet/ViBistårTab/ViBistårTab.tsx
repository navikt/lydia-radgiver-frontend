import { BodyShort, Heading } from "@navikt/ds-react";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { NyIALeveranseSkjema } from "./NyIALeveranseSkjema";
import { IASakLeveranse } from "./IASakLeveranse";
import { iaSakLeveranser, IATjenester } from "../mocks/iaSakLeveranseMock";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

interface Props {
    iaSak: IASak;
}

export const ViBistårTab = ({ iaSak }: Props) => {
    const iaTjenester = IATjenester;
    const leveranser = iaSakLeveranser;

    return (
        <Container>
            <div>
                <Heading size="medium">Leveranser</Heading>
                <BodyShort>Her kan du legge leveranser når du bistår i saken.</BodyShort>
            </div>
            {
                iaTjenester.map((tjeneste) => (
                    <div key={tjeneste.id}>
                        <Heading size="small" key={tjeneste.id}>{tjeneste.navn}</Heading>
                        {leveranser.filter((leveranse) => leveranse.modul.iaTjeneste.id === (tjeneste.id)).map((leveranse) =>
                            <IASakLeveranse leveranse={leveranse} key={leveranse.id} />)}
                    </div>
                ))
            }
            {iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR &&
                <NyIALeveranseSkjema saksnummer={iaSak.saksnummer} />
            }
        </Container>
    )
}

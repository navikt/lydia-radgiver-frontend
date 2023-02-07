import { BodyShort, Heading } from "@navikt/ds-react";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { NyIALeveranseSkjema } from "./NyIALeveranseSkjema";
import { IASakLeveranse } from "./IASakLeveranse";
import { iaSakLeveranser } from "../mocks/iaSakLeveranseMock";

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
    const leveranser = iaSakLeveranser;

    return (
        <Container>
            <div>
                <Heading size="medium">Leveranser</Heading>
                <BodyShort>(Her skal det ligge leveranser)</BodyShort>
                {leveranser.map((leveranse) => <IASakLeveranse leveranse={leveranse} key={leveranse.id} />)}
            </div>

            { iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR &&
                <NyIALeveranseSkjema saksnummer={iaSak.saksnummer} />
            }
        </Container>
    )
}

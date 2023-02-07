import { BodyShort, Heading } from "@navikt/ds-react";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { NyIALeveranseSkjema } from "./NyIALeveranseSkjema";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

interface Props {
    iaSak?: IASak;
}

export const ViBistårTab = ({ iaSak }: Props) => {
    if (!iaSak) return <p>Klarte ikke å hente sak</p>

    return (
        <Container>
            <div>
                <Heading size="medium">Leveranser</Heading>
                <BodyShort>(Her skal det ligge leveranser)</BodyShort>
            </div>

            { iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR &&
                <NyIALeveranseSkjema saksnummer={iaSak.saksnummer} />
            }
        </Container>
    )
}

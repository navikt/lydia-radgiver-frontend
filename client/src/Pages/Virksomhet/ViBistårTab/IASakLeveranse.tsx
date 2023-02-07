import styled from "styled-components";
import { IASakLeveranse as IASakLeveranseType } from "../../../domenetyper/iaLeveranse";
import { lokalDato } from "../../../util/dato";
import { BodyShort } from "@navikt/ds-react";

const Container = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

interface Props {
    leveranse: IASakLeveranseType
}

export const IASakLeveranse = ({ leveranse }: Props) => {
    return (
        <Container>
            <BodyShort>{`${leveranse.modul.navn}`}</BodyShort>
            <BodyShort>{`Frist: ${lokalDato(leveranse.frist)}`}</BodyShort>
            <BodyShort>{`Status: ${leveranse.status.toLowerCase()}`}</BodyShort>
        </Container>
    )
}

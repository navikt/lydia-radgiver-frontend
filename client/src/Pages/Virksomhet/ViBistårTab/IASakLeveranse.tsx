import styled from "styled-components";
import { BodyShort, Button } from "@navikt/ds-react";
import { DeleteFilled as Delete } from "@navikt/ds-icons";
import { IASakLeveranse as IASakLeveranseType } from "../../../domenetyper/iaLeveranse";
import { lokalDato } from "../../../util/dato";
import { NavFarger } from "../../../styling/farger";

const Container = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  gap: 4rem;
  
  background: white;
  margin-bottom: 1rem;

  max-width: 60rem;
`;

const ModulNavn = styled(BodyShort)`
  flex: 1;
`;

const FjernLeveranseKnapp = styled(Button)`
  color: ${NavFarger.text};

`;

interface Props {
    leveranse: IASakLeveranseType
}

export const IASakLeveranse = ({ leveranse }: Props) => {
    return (
        <Container>
            <ModulNavn>{`${leveranse.modul.navn}`}</ModulNavn>
            <BodyShort>{`Frist: ${lokalDato(leveranse.frist)}`}</BodyShort>
            <Button disabled={true}>Fullfør</Button>
            <FjernLeveranseKnapp disabled={true} variant="tertiary" icon={<Delete title="Fjern leveranse" />}></FjernLeveranseKnapp>
        </Container>
    )
}

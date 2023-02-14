import styled from "styled-components";
import { BodyShort, Button } from "@navikt/ds-react";
import { DeleteFilled as Delete } from "@navikt/ds-icons";
import { IASakLeveranse as IASakLeveranseType, IASakLeveranseStatusEnum } from "../../../domenetyper/iaLeveranse";
import { lokalDato } from "../../../util/dato";
import { NavFarger } from "../../../styling/farger";
import { fullførIASakLeveranse } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";

const Container = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  gap: 4rem;

  background: white;
  padding: 0.5rem 1.5rem;

  max-width: 60rem;
`;

const ModulNavn = styled(BodyShort)`
  flex: 1;
`;

const FullførKnapp = styled(Button)`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;

const FjernLeveranseKnapp = styled(Button)`
  color: ${NavFarger.text};

`;

interface Props {
    leveranse: IASakLeveranseType
    iaSak: IASak;
}

export const IASakLeveranse = ({ leveranse, iaSak }: Props) => {
    const leveranseErFullført = leveranse.status === IASakLeveranseStatusEnum.enum.LEVERT;

    const fullførOppgave = () => {
        // Send til backend
        fullførIASakLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
        // Vent på svar
        // Muterstate
    }

    return (
        <Container>
            <ModulNavn>{`${leveranse.modul.navn}`}</ModulNavn>
            <BodyShort>{`Frist: ${lokalDato(leveranse.frist)}`}</BodyShort>
            <FullførKnapp onClick={fullførOppgave} disabled={leveranseErFullført} size="small">Fullfør</FullførKnapp>
            <FjernLeveranseKnapp disabled={true} variant="tertiary" icon={<Delete title="Fjern leveranse" />} />
        </Container>
    )
}

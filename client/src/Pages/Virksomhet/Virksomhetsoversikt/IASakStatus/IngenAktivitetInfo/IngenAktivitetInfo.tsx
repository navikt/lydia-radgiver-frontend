import styled from "styled-components";
import { FlowerPetalFallingIcon } from '@navikt/aksel-icons';
import { NavFarger } from "../../../../../styling/farger";
import { BorderRadius } from "../../../../../styling/borderRadius";
import { Skygger } from "../../../../../styling/skygger";
import { aktivitetIForrigeKvartalEllerNyere } from "./datoTilKvartal";
import { IASak } from "../../../../../domenetyper/domenetyper";

const Container = styled.p`
  background: ${NavFarger.orange100};
  border-radius: ${BorderRadius.medium};
  padding: ${14 / 16}rem;
  margin: 0;
  box-shadow: ${Skygger.small};
`

interface Props {
    sak: IASak;
}

export const IngenAktivitetInfo = ({sak}: Props) => {
    if (!sak.endretTidspunkt) {
        return null; // Vi har ingen info
    }

    if (aktivitetIForrigeKvartalEllerNyere(new Date(), sak.endretTidspunkt)) {
        return null;
    }

    return (
        <Container>
            Ingen aktivitet har blitt registrert gjennom hele forrige kvartal <FlowerPetalFallingIcon
            fontSize={"1.125rem"} />
        </Container>
    )
}

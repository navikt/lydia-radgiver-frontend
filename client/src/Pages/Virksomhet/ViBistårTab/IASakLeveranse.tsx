import styled from "styled-components";
import { BodyShort, Button } from "@navikt/ds-react";
import { DeleteFilled as Delete } from "@navikt/ds-icons";
import { IASakLeveranse as IASakLeveranseType, IASakLeveranseStatusEnum } from "../../../domenetyper/iaLeveranse";
import { lokalDato } from "../../../util/dato";
import { NavFarger } from "../../../styling/farger";
import { fullførIASakLeveranse, slettIASakLeveranse, useHentIASakLeveranser } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";

const Container = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  gap: clamp(1.5rem, 14vw - 5.5rem, 4rem);
  padding: 0.5rem 1.5rem;

  max-width: 60rem;

  border-bottom: 1px solid ${NavFarger.borderDefault};

`;

const ModulNavn = styled(BodyShort)`
  flex: 1;
`;

const Frist = styled(BodyShort)`
  flex-shrink: 0;
`;

const FullførKnapp = styled(Button)`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  min-width: 5.8em;
`;

const FjernLeveranseKnapp = styled(Button)`
  color: ${NavFarger.text};
  padding: 0;
`;

interface Props {
    leveranse: IASakLeveranseType
    iaSak: IASak;
}

export const IASakLeveranse = ({ leveranse, iaSak }: Props) => {
    const leveranseErFullført = leveranse.status === IASakLeveranseStatusEnum.enum.LEVERT;
    const fullførKnappTekst = leveranseErFullført ? "Fullført" : "Fullfør";
    const { mutate: hentLeveranserPåNytt } = useHentIASakLeveranser(iaSak.orgnr, leveranse.saksnummer);

    const fullførOppgave = () => {
        fullførIASakLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => hentLeveranserPåNytt());
    }

    const slettLeveranse = () => {
        slettIASakLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id)
            .then(() => hentLeveranserPåNytt());
    }

    return (
        <Container>
            <ModulNavn>{`${leveranse.modul.navn}`}</ModulNavn>
            <Frist>{`Frist: ${lokalDato(leveranse.frist)}`}</Frist>
            <FullførKnapp onClick={fullførOppgave} disabled={leveranseErFullført} size="small">
                {fullførKnappTekst}
            </FullførKnapp>
            <FjernLeveranseKnapp onClick={slettLeveranse} variant="tertiary" icon={<Delete title="Fjern leveranse" />} />
        </Container>
    )
}

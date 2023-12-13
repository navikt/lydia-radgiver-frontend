import { BodyShort, Loader } from "@navikt/ds-react";
import { IATjeneste } from "./IATjeneste";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { LeveranserPerIATjeneste } from "../../../domenetyper/leveranse";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  max-width: 60rem;
`;

interface Props {
    iaSak: IASak;
    lasterLeveranserPerIATjeneste: boolean;
    leveranserPerIATjeneste?: LeveranserPerIATjeneste[];
}

export const LeveranseOversikt = ({ iaSak, leveranserPerIATjeneste, lasterLeveranserPerIATjeneste }: Props) => {

    if (lasterLeveranserPerIATjeneste) {
        return <Loader />
    }

    if (!leveranserPerIATjeneste) {
        return <BodyShort>Kunne ikke hente leveranser</BodyShort>
    }

    return (
        <Container>
            {
                leveranserPerIATjeneste.sort(sorterPåTjenesteId).map((iaTjenesteMedLeveranser) => (
                        <IATjeneste iaTjenesteMedLeveranser={iaTjenesteMedLeveranser}
                                    iaSak={iaSak}
                                    key={iaTjenesteMedLeveranser.iaTjeneste.id} />
                    )
                )
            }
        </Container>
    )
}

const sorterPåTjenesteId = (a: LeveranserPerIATjeneste, b: LeveranserPerIATjeneste) => {
    return a.iaTjeneste.id - b.iaTjeneste.id
}

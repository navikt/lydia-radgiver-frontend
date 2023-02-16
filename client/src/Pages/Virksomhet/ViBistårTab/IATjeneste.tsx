import { IASakLeveranserPerTjeneste } from "../../../domenetyper/iaLeveranse";
import { Heading } from "@navikt/ds-react";
import { IASakLeveranse } from "./IASakLeveranse";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";

const TjenesteHeading = styled(Heading)`
  padding: 0.5rem 1.5rem;
`;

interface Props {
    iaTjenesteMedLeveranser: IASakLeveranserPerTjeneste;
    iaSak: IASak;
}

export const IATjeneste = ({ iaTjenesteMedLeveranser, iaSak }: Props) => {
    if (iaTjenesteMedLeveranser.leveranser.length < 1) {
        return null;
    }

    return (
        <div>
            <TjenesteHeading size="xsmall">{iaTjenesteMedLeveranser.iaTjeneste.navn}</TjenesteHeading>
            {
                iaTjenesteMedLeveranser.leveranser
                    .map((leveranse) =>
                        <IASakLeveranse leveranse={leveranse} iaSak={iaSak} key={leveranse.id} />)
            }
        </div>
    )
}

import { IASakLeveranserPerTjeneste } from "../../../domenetyper/iaLeveranse";
import { Heading } from "@navikt/ds-react";
import { IASakLeveranse } from "./IASakLeveranse";
import { IASak } from "../../../domenetyper/domenetyper";

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
            <Heading size="small">{iaTjenesteMedLeveranser.iaTjeneste.navn}</Heading>
            {
                iaTjenesteMedLeveranser.leveranser
                    .map((leveranse) =>
                        <IASakLeveranse leveranse={leveranse} iaSak={iaSak} key={leveranse.id} />)
            }
        </div>
    )
}

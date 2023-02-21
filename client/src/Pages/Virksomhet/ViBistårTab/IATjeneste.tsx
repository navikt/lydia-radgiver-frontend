import { Heading, Table } from "@navikt/ds-react";
import { IASakLeveranserPerTjeneste } from "../../../domenetyper/iaLeveranse";
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
        <Table>
            <Table.Header>
                <Table.HeaderCell colSpan={5}>
                    <Heading size="xsmall">{iaTjenesteMedLeveranser.iaTjeneste.navn}</Heading>
                </Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {
                    iaTjenesteMedLeveranser.leveranser
                        .map((leveranse) =>
                            <IASakLeveranse leveranse={leveranse} iaSak={iaSak} key={leveranse.id} />)
                }
            </Table.Body>
        </Table>
    )
}

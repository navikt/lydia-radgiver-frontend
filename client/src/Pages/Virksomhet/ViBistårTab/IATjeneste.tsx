import { Heading, Table } from "@navikt/ds-react";
import { LeveranserPerIATjeneste } from "../../../domenetyper/leveranse";
import { Leveranse } from "./Leveranse";
import { IASak } from "../../../domenetyper/domenetyper";

interface Props {
    iaTjenesteMedLeveranser: LeveranserPerIATjeneste;
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
                            <Leveranse leveranse={leveranse} iaSak={iaSak} key={leveranse.id} />)
                }
            </Table.Body>
        </Table>
    )
}

import { Table } from "@navikt/ds-react";
import {
    aktivitetIForrigeKvartalEllerNyere
} from "../Virksomhet/Virksomhetsoversikt/IASakStatus/IngenAktivitetInfo/datoTilKvartal";
import { lokalDato } from "../../util/dato";
import { Blomsterikon } from "../../components/Blomsterikon";

interface Props {
    sistEndret: Date | null;
    lukket: boolean;
}

export const EndretDataCell = ({sistEndret, lukket}: Props) => {
    if (!sistEndret) {
        return (
            <Table.DataCell>
            </Table.DataCell>
        )
    }

    if (!aktivitetIForrigeKvartalEllerNyere(new Date(), sistEndret) && !lukket) {
        return (
            <Table.DataCell style={{fontWeight: "bold", whiteSpace: "nowrap"}}>
                {lokalDato(sistEndret)}
                <Blomsterikon title="Denne saken hadde ingen endringer gjennom hele forrige kvartal" />
            </Table.DataCell>
        );
    }

    return (
        <Table.DataCell>
            {lokalDato(sistEndret)}
        </Table.DataCell>
    )
}

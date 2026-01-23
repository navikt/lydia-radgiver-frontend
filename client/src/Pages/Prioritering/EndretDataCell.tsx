import { Table } from "@navikt/ds-react";
import { lokalDato } from "../../util/dato";

interface Props {
    sistEndret: Date | null;
}

export const EndretDataCell = ({ sistEndret }: Props) => {
    return (
        <Table.DataCell>{sistEndret && lokalDato(sistEndret)}</Table.DataCell>
    );
};

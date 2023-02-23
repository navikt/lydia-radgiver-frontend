import { Table } from "@navikt/ds-react";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { Lederstatistikk } from "../../domenetyper/lederstatistikk";

interface Props {
    lederstatistikkListe: Lederstatistikk[]
}

export const StatistikkTabell = ({ lederstatistikkListe }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Antall bedrifter</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {lederstatistikkListe?.map(({ status, antall }, i) => {
                    return (
                        <Table.Row key={i + status}>
                            <Table.HeaderCell scope="row"><StatusBadge status={status} /></Table.HeaderCell>
                            <Table.DataCell>{antall}</Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>)
}
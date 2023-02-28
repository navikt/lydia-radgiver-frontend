import styled from "styled-components";
import { Table } from "@navikt/ds-react";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { Statusoversikt } from "../../domenetyper/statusoversikt";
import { hvitBoksMedSkygge } from "../../styling/containere";

const Tabell = styled(Table)`
    ${hvitBoksMedSkygge};
`;

interface Props {
    lederstatistikkListe: Statusoversikt[]
}

export const StatistikkTabell = ({ lederstatistikkListe }: Props) => {
    return (
        <Tabell size={"small"}>
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
        </Tabell>)
}

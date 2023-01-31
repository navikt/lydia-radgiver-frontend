import { Detail, Table } from "@navikt/ds-react";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { lokalDato } from "../../../util/dato";
import { NavIdentMedLenke } from "../../../components/NavIdentMedLenke";
import { NavFarger } from "../../../styling/farger";
import { Skygger } from "../../../styling/skygger";
import { BorderRadius } from "../../../styling/borderRadius";
import styled from "styled-components";
import { Sakshistorikk } from "../../../domenetyper/sakshistorikk";

const StyledTable = styled(Table)`
  background-color: ${NavFarger.white};
  box-shadow: ${Skygger.small};
  border-radius: ${BorderRadius.medium};
`;

interface SakshistorikkTabellProps {
    sakshistorikk: Sakshistorikk;
}

export const SakshistorikkTabell = ({ sakshistorikk }: SakshistorikkTabellProps) => {
    const kolonneNavn = ["Status", "Tidspunkt", "Begrunnelse", "Eier"];

    return (
        <StyledTable zebraStripes={true}>
            <Table.Header>
                <Table.Row>
                    {kolonneNavn.map((navn) => (
                        <Table.HeaderCell scope="col" key={navn}>
                            {navn}
                        </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sakshistorikk.sakshendelser.map((sakSnapshot, index) => {
                    return (
                        <Table.Row key={index}>
                            <Table.DataCell>
                                <StatusBadge status={sakSnapshot.status} />
                            </Table.DataCell>
                            <Table.DataCell>
                                {lokalDato(sakSnapshot.tidspunktForSnapshot)}
                            </Table.DataCell>
                            <Table.DataCell>
                                <ul style={{ margin: "0" }}>
                                    {sakSnapshot.begrunnelser.map(begrunnelse =>
                                        (<li key={begrunnelse}>
                                            <Detail>{begrunnelse}</Detail>
                                        </li>)
                                    )}
                                </ul>
                            </Table.DataCell>
                            <Table.DataCell>
                                <NavIdentMedLenke navIdent={sakSnapshot.eier} />
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </StyledTable>
    );
};

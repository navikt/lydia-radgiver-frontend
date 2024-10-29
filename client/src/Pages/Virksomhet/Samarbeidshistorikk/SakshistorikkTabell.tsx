import { Detail, Table } from "@navikt/ds-react";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { lokalDato } from "../../../util/dato";
import { NavIdentMedLenke } from "../../../components/NavIdentMedLenke";
import { Sakshistorikk } from "../../../domenetyper/sakshistorikk";
import { StyledTable } from "../../../components/StyledTable";
import { ScrollUtTilKantenContainer } from "../../../components/ScrollUtTilKantenContainer/ScrollUtTilKantenContainer";

interface SakshistorikkTabellProps {
    sakshistorikk: Sakshistorikk;
}

export const SakshistorikkTabell = ({
    sakshistorikk,
}: SakshistorikkTabellProps) => {
    const kolonneNavn = ["Status", "Tidspunkt", "Detaljer", "Endret av"];

    return (
        <>
            <h3>Sakshistorikk</h3>
            <ScrollUtTilKantenContainer
                $offsetLeft={1.5 + 2.75}
                $offsetRight={1.5 + 0.75}
            >
                <StyledTable>
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
                        {sakshistorikk.sakshendelser.map(
                            (sakSnapshot, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.DataCell>
                                            <StatusBadge
                                                status={sakSnapshot.status}
                                            />
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {lokalDato(
                                                sakSnapshot.tidspunktForSnapshot,
                                            )}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {sakSnapshot.begrunnelser.length >
                                                0 && (
                                                <>
                                                    <Detail>Begrunnelse</Detail>
                                                    <ul>
                                                        {sakSnapshot.begrunnelser.map(
                                                            (begrunnelse) => (
                                                                <li
                                                                    key={
                                                                        begrunnelse
                                                                    }
                                                                >
                                                                    <Detail>
                                                                        {
                                                                            begrunnelse
                                                                        }
                                                                    </Detail>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </>
                                            )}
                                            {sakSnapshot.hendelsestype ===
                                                "TA_EIERSKAP_I_SAK" && (
                                                <Detail>
                                                    Tok eierskap i sak
                                                </Detail>
                                            )}
                                            {sakSnapshot.hendelsestype ===
                                                "ENDRE_PROSESS" && (
                                                <Detail>
                                                    Endret samarbeidsnavn
                                                </Detail>
                                            )}
                                            {sakSnapshot.hendelsestype ===
                                                "NY_PROSESS" && (
                                                <Detail>Nytt samarbeid</Detail>
                                            )}
                                            {sakSnapshot.hendelsestype ===
                                                "SLETT_PROSESS" && (
                                                <Detail>
                                                    Slettet samarbeid
                                                </Detail>
                                            )}
                                            {sakSnapshot.status === "NY" && (
                                                <Detail>Opprettet sak</Detail>
                                            )}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <NavIdentMedLenke
                                                navIdent={
                                                    sakSnapshot.hendelseOpprettetAv
                                                }
                                            />
                                        </Table.DataCell>
                                    </Table.Row>
                                );
                            },
                        )}
                    </Table.Body>
                </StyledTable>
            </ScrollUtTilKantenContainer>
        </>
    );
};

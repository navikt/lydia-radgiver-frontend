import styled from "styled-components";
import { Table, Heading, Detail, Accordion } from "@navikt/ds-react";
import { Sakshistorikk } from "../../domenetyper";
import { lokalDato, lokalDatoMedTid } from "../../util/dato";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";

const bakgrunnsRamme = {
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(38, 38, 38, 0.12), 0px 1px 3px rgba(38, 38, 38, 0.2)"
};

interface SamarbeidshistorikkProps {
    samarbeidshistorikk: Sakshistorikk[];
    className?: string;
}

const Samarbeidshistorikk = ({samarbeidshistorikk, className}: SamarbeidshistorikkProps) => {
    const sortertHistorikk: Sakshistorikk[] = samarbeidshistorikk.map((historikk) => ({
        saksnummer: historikk.saksnummer,
        opprettet: historikk.opprettet,
        sakshendelser: sorterSakshistorikkPåTid(historikk)
    }))
    return (
        <div className={className}>
            <Heading
                size="medium"
                level={"2"}
                style={{
                    padding: "1rem 3rem",
                    borderBottom: "1px solid black",
                    ...bakgrunnsRamme
                }}
            >
                Samarbeidshistorikk
            </Heading>
            {sortertHistorikk.length > 0 ? (
                sortertHistorikk.map(sakshistorikk =>
                    <Accordion key={sakshistorikk.saksnummer}>
                        <Accordion.Item>
                            <Accordion.Header>
                                <div style={{
                                    display: "inline-flex",
                                    gap: "2rem",
                                    padding: "0 1rem",
                                    alignItems: "center",
                                }}>
                                    <StatusBadge status={sakshistorikk.sakshendelser[0].status} />
                                    Sist oppdatert: {lokalDato(sakshistorikk.sakshendelser[0].tidspunktForSnapshot)} -
                                    Saksnummer: {sakshistorikk.saksnummer}
                                </div>
                            </Accordion.Header>
                            <Accordion.Content>
                                <SakshistorikkTabell
                                    key={sakshistorikk.saksnummer}
                                    sakshistorikk={sakshistorikk}
                                />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                )
            ) : (
                <IngenHendelserPåSak />
            )}
        </div>
    );
};

const IngenHendelserPåSak = () => {
    return (
        <Detail size="small" style={{padding: "1rem 3rem"}}>
            Fant ingen samarbeidshistorikk på denne virksomheten
        </Detail>
    );
};

interface SakshistorikkTabellProps {
    sakshistorikk: Sakshistorikk;
}

const SakshistorikkTabell = ({sakshistorikk}: SakshistorikkTabellProps) => {
    const kolonneNavn = ["Status", "Tidspunkt", "Begrunnelse", "Eier"];

    return (
        <Table zebraStripes style={bakgrunnsRamme}>
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
                                {lokalDatoMedTid(sakSnapshot.tidspunktForSnapshot)}
                            </Table.DataCell>
                            <Table.DataCell>
                                <ul style={{margin: "0"}}>
                                    {sakSnapshot.begrunnelser.map(begrunnelse =>
                                        (<li key={begrunnelse}>
                                            <Detail size={"small"}>{begrunnelse}</Detail>
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
        </Table>
    );
};

export const StyledSamarbeidshistorikk = styled(Samarbeidshistorikk)`
  display: grid;
  grid-gap: 2rem;
`;

function sorterSakshistorikkPåTid({sakshendelser}: Sakshistorikk) {
    return sakshendelser.sort(
        (a, b) =>
            b.tidspunktForSnapshot.getTime() -
            a.tidspunktForSnapshot.getTime()
    )
}
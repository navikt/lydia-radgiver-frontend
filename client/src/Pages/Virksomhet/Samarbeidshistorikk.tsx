import styled from "styled-components";
import { Accordion, Detail, Heading, Table } from "@navikt/ds-react";
import { Sakshistorikk } from "../../domenetyper";
import { lokalDato } from "../../util/dato";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import { Skygger } from "../../styling/skygger";
import { NavFarger } from "../../styling/farger";
import { BorderRadius } from "../../styling/borderRadius";

const bakgrunnsRamme = {
    backgroundColor: `${NavFarger.white}`,
    boxShadow: `${Skygger.small}`,
    borderRadius: `${BorderRadius.medium}`,
};

const Container = styled.div`
  display: grid;
  grid-gap: 2rem;
`;

const AccordionHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

interface SamarbeidshistorikkProps {
    samarbeidshistorikk: Sakshistorikk[];
    className?: string;
}

export const Samarbeidshistorikk = ({samarbeidshistorikk, className}: SamarbeidshistorikkProps) => {
    const sortertHistorikk: Sakshistorikk[] = samarbeidshistorikk.map((historikk) => ({
        saksnummer: historikk.saksnummer,
        opprettet: historikk.opprettet,
        sakshendelser: sorterSakshistorikkPåTid(historikk)
    }))

    return (
        <Container className={className}>
            <Heading size="medium" level={"3"} style={{padding: "1rem 3rem", ...bakgrunnsRamme}}>
                Samarbeidshistorikk
            </Heading>
            {sortertHistorikk.length > 0 ? (
                sortertHistorikk.map(sakshistorikk =>
                    <Accordion key={sakshistorikk.saksnummer}>
                        <Accordion.Item>
                            <Accordion.Header>
                                <AccordionHeaderContent>
                                    <StatusBadge status={sakshistorikk.sakshendelser[0].status} />
                                    Sist oppdatert: {lokalDato(sakshistorikk.sakshendelser[0].tidspunktForSnapshot)} -
                                    Saksnummer: {sakshistorikk.saksnummer}
                                </AccordionHeaderContent>
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
        </Container>
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
                                {lokalDato(sakSnapshot.tidspunktForSnapshot)}
                            </Table.DataCell>
                            <Table.DataCell>
                                <ul style={{margin: "0"}}>
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
        </Table>
    );
};

const IngenHendelserDetail = styled(Detail)`
  padding: 1rem 3rem;
`;

const IngenHendelserPåSak = () => {
    return (
        <IngenHendelserDetail>
            Fant ingen samarbeidshistorikk på denne virksomheten
        </IngenHendelserDetail>
    );
};

function sorterSakshistorikkPåTid({sakshendelser}: Sakshistorikk) {
    return sakshendelser.sort(
        (a, b) =>
            b.tidspunktForSnapshot.getTime() -
            a.tidspunktForSnapshot.getTime()
    )
}

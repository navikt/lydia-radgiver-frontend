import styled from "styled-components";
import { Accordion, BodyShort } from "@navikt/ds-react";
import { lokalDato } from "../../../util/dato";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { SakshistorikkTabell } from "./SakshistorikkTabell";
import { Sakshistorikk } from "../../../domenetyper/sakshistorikk";

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

export const Samarbeidshistorikk = ({ samarbeidshistorikk, className }: SamarbeidshistorikkProps) => {
    const sortertHistorikk: Sakshistorikk[] = samarbeidshistorikk.map((historikk) => ({
        saksnummer: historikk.saksnummer,
        opprettet: historikk.opprettet,
        sakshendelser: sorterSakshistorikkPåTid(historikk)
    }))

    return (
        <Container className={className}>
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

const IngenHendelserDetail = styled(BodyShort)`
  padding: 1rem 1rem;
`;

const IngenHendelserPåSak = () => {
    return (
        <IngenHendelserDetail>
            Fant ingen samarbeidshistorikk på denne virksomheten
        </IngenHendelserDetail>
    );
};

function sorterSakshistorikkPåTid({ sakshendelser }: Sakshistorikk) {
    return sakshendelser.sort(
        (a, b) =>
            b.tidspunktForSnapshot.getTime() -
            a.tidspunktForSnapshot.getTime()
    )
}

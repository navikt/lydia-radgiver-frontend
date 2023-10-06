import styled from "styled-components";
import { Accordion, BodyShort, Heading, Loader } from "@navikt/ds-react";
import { lokalDato } from "../../../util/dato";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { SakshistorikkTabell } from "./SakshistorikkTabell";
import { Sakshistorikk } from "../../../domenetyper/sakshistorikk";
import { useHentSamarbeidshistorikk } from "../../../api/lydia-api";
import { tabInnholdStyling } from "../../../styling/containere";
import { LeveransehistorikkTabell } from "./LeveransehistorikkTabell";

const Container = styled.div`
  ${tabInnholdStyling};
`;

const AccordionHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

interface SamarbeidshistorikkProps {
    orgnr: string;
    className?: string;
}

export const SamarbeidshistorikkFane = ({ orgnr, className }: SamarbeidshistorikkProps) => {
    const {
        data: samarbeidshistorikk,
        loading: lasterSamarbeidshistorikk
    } = useHentSamarbeidshistorikk(orgnr)

    if (lasterSamarbeidshistorikk) {
        return (
            <Container className={className}>
                <Heading spacing={true} size="large">Samarbeidshistorikk</Heading>
                <Loader/>
            </Container>
        )
    }

    if (!samarbeidshistorikk) {
        return (
            <Container className={className}>
                <Heading spacing={true} size="large">Samarbeidshistorikk</Heading>
                <BodyShort>Kunne ikke hente samarbeidshistorikk</BodyShort>
            </Container>
        )
    }

    const sortertHistorikk = samarbeidshistorikk.map((historikk) => ({
        saksnummer: historikk.saksnummer,
        opprettet: historikk.opprettet,
        sistEndret: historikk.sistEndret,
        sakshendelser: sorterSakshistorikkPåTid(historikk)
    }))

    return (
        <Container className={className}>
            <Heading level="3" size="large" spacing={true}>Samarbeidshistorikk</Heading>
            {sortertHistorikk.length > 0 ? (
                    <Accordion>
                        {sortertHistorikk.map(sakshistorikk =>
                            <Accordion.Item key={sakshistorikk.saksnummer}>
                                <Accordion.Header>
                                    <AccordionHeaderContent>
                                        <StatusBadge status={sakshistorikk.sakshendelser[0].status} />
                                        Sist oppdatert: {lokalDato(sakshistorikk.sistEndret)}
                                    </AccordionHeaderContent>
                                </Accordion.Header>
                                <Accordion.Content>
                                    <LeveransehistorikkTabell
                                        orgnr={orgnr}
                                        saksnummer={sakshistorikk.saksnummer}
                                    />
                                    <br />
                                    <SakshistorikkTabell
                                        key={sakshistorikk.saksnummer}
                                        sakshistorikk={sakshistorikk}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                        )}
                    </Accordion>)
                : (
                    <BodyShort>
                        Fant ingen samarbeidshistorikk på denne virksomheten
                    </BodyShort>
                )}
        </Container>
    );
};

function sorterSakshistorikkPåTid({ sakshendelser }: Sakshistorikk) {
    return sakshendelser.sort(
        (a, b) =>
            b.tidspunktForSnapshot.getTime() -
            a.tidspunktForSnapshot.getTime()
    )
}

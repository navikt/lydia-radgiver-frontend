import { Accordion, BodyShort, Heading, Loader } from "@navikt/ds-react";
import { lokalDato } from "../../../util/dato";
import { IAProsessStatusBadge } from "../../../components/Badge/IAProsessStatusBadge";
import { SakshistorikkTabell } from "./SakshistorikkTabell";
import { Sakshistorikk } from "../../../domenetyper/sakshistorikk";
import { useHentSakshistorikk } from "../../../api/lydia-api/virksomhet";
import { LeveransehistorikkTabell } from "./LeveransehistorikkTabell";
import Samarbeidshistorikk from "./Samarbeidshistorikk";
import styles from './sakshistorikk.module.scss';

interface SakshistorikkProps {
    orgnr: string;
    className?: string;
}

export const SakshistorikkFane = ({
    orgnr,
    className,
}: SakshistorikkProps) => {
    const { data: sakshistorikk, loading: lasterSakshistorikk } =
        useHentSakshistorikk(orgnr);

    if (lasterSakshistorikk) {
        return (
            <div className={`${styles.samarbeidshistorikkfaneContainer} ${className}`}>
                <Heading spacing={true} size="large">
                    Sakshistorikk
                </Heading>
                <Loader />
            </div>
        );
    }

    if (!sakshistorikk) {
        return (
            <div className={`${styles.samarbeidshistorikkfaneContainer} ${className}`}>
                <Heading spacing={true} size="large">
                    Sakshistorikk
                </Heading>
                <BodyShort>Kunne ikke hente sakshistorikk</BodyShort>
            </div>
        );
    }

    const sortertHistorikk = sakshistorikk.map((historikk) => ({
        ...historikk,
        sakshendelser: sorterSakshistorikkPåTid(historikk),
    }));

    return (
        <div className={`${styles.samarbeidshistorikkfaneContainer} ${className}`}>
            <Heading level="3" size="large" spacing={true}>
                Historikk
            </Heading>
            {sortertHistorikk.length > 0 ? (
                <Accordion>
                    {sortertHistorikk.map((sakshistorikk) => (
                        <Accordion.Item key={sakshistorikk.saksnummer}>
                            <Accordion.Header>
                                <div className={styles.accordionHeaderContent}>
                                    <IAProsessStatusBadge
                                        status={
                                            sakshistorikk.sakshendelser[0]
                                                .status
                                        }
                                    />
                                    Sist oppdatert:{" "}
                                    {lokalDato(sakshistorikk.sistEndret)}
                                </div>
                            </Accordion.Header>
                            <Accordion.Content>
                                <Samarbeidshistorikk historikk={sakshistorikk} orgnr={orgnr} />
                                <LeveransehistorikkTabell
                                    orgnr={orgnr}
                                    saksnummer={sakshistorikk.saksnummer}
                                />
                                <SakshistorikkTabell
                                    key={sakshistorikk.saksnummer}
                                    sakshistorikk={sakshistorikk}
                                />
                            </Accordion.Content>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : (
                <BodyShort>
                    Fant ingen sakshistorikk på denne virksomheten
                </BodyShort>
            )}
        </div>
    );
};

export function sorterSakshistorikkPåTid({ sakshendelser }: Sakshistorikk) {
    return sakshendelser.sort(
        (a, b) =>
            b.tidspunktForSnapshot.getTime() - a.tidspunktForSnapshot.getTime(),
    );
}

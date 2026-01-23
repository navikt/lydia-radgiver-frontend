import { Accordion, BodyShort, Heading, Loader } from "@navikt/ds-react";
import { useHentSakshistorikk } from "../../../../api/lydia-api/virksomhet";
import { Sakshistorikk } from "../../../../domenetyper/sakshistorikk";
import styles from "./sykefraværshistorikkinnhold.module.scss";
import { IAProsessStatusBadge } from "../../../../components/Badge/IAProsessStatusBadge";
import { lokalDato } from "../../../../util/dato";
import Samarbeidshistorikk from "../Samarbeidshistorikk";
import { LeveransehistorikkTabell } from "../LeveransehistorikkTabell";
import { SakshistorikkTabell } from "../SakshistorikkTabell";

type SakshistorikkInnholdProps = {
    sakshistorikk?: Sakshistorikk[];
    lasterSakshistorikk: boolean;
    orgnr: string;
    defaultOpenFørste?: boolean;
};

export default function SakshistorikkMedDatahenting({
    orgnr,
    Innhold = SakshistorikkWrapper,
}: {
    orgnr: string;
    Innhold?: React.ComponentType<SakshistorikkInnholdProps>;
}) {
    const { data: sakshistorikk, loading: lasterSakshistorikk } =
        useHentSakshistorikk(orgnr);

    return (
        <Innhold
            sakshistorikk={sakshistorikk}
            lasterSakshistorikk={lasterSakshistorikk}
            orgnr={orgnr}
        />
    );
}

function SakshistorikkWrapper({
    sakshistorikk,
    lasterSakshistorikk,
    orgnr,
}: SakshistorikkInnholdProps) {
    return (
        <div className={styles.samarbeidshistorikkfaneContainer}>
            <Heading level="3" size="large" spacing={true}>
                Historikk
            </Heading>
            <SykefraværshistorikkInnhold
                sakshistorikk={sakshistorikk}
                lasterSakshistorikk={lasterSakshistorikk}
                orgnr={orgnr}
            />
        </div>
    );
}

export function SykefraværshistorikkInnhold({
    sakshistorikk,
    lasterSakshistorikk,
    orgnr,
    defaultOpenFørste = false,
}: SakshistorikkInnholdProps) {
    if (lasterSakshistorikk) {
        return <Loader />;
    }

    if (!sakshistorikk) {
        return <BodyShort>Kunne ikke hente sakshistorikk</BodyShort>;
    }

    if (sakshistorikk.length === 0) {
        return (
            <BodyShort>
                Fant ingen sakshistorikk på denne virksomheten
            </BodyShort>
        );
    }

    const sortertHistorikk = sakshistorikk.map((historikk) => ({
        ...historikk,
        sakshendelser: sorterSakshistorikkPåTid(historikk),
    }));

    return (
        <Accordion>
            {sortertHistorikk.map((sakshistorikk, saksindex) => (
                <Accordion.Item
                    key={sakshistorikk.saksnummer}
                    defaultOpen={defaultOpenFørste && saksindex === 0}
                >
                    <Accordion.Header>
                        <div className={styles.accordionHeaderContent}>
                            <IAProsessStatusBadge
                                status={sakshistorikk.sakshendelser[0].status}
                            />
                            Sist oppdatert:{" "}
                            {lokalDato(sakshistorikk.sistEndret)}
                        </div>
                    </Accordion.Header>
                    <Accordion.Content>
                        <Samarbeidshistorikk
                            historikk={sakshistorikk}
                            orgnr={orgnr}
                        />
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
    );
}

function sorterSakshistorikkPåTid({ sakshendelser }: Sakshistorikk) {
    return sakshendelser.sort(
        (a, b) =>
            b.tidspunktForSnapshot.getTime() - a.tidspunktForSnapshot.getTime(),
    );
}

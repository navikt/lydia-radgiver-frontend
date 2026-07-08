import {
    Accordion,
    BodyShort,
    Button,
    Heading,
    HStack,
    Loader,
    Tabs,
    VStack,
} from "@navikt/ds-react";
import { Sakshistorikk } from "../../../../domenetyper/sakshistorikk";
import styles from "./sykefraværshistorikkinnhold.module.scss";
import { lokalDato } from "../../../../util/dato";
import { LeveransehistorikkTabell } from "../LeveransehistorikkTabell";
import { SakshistorikkTabell } from "../SakshistorikkTabell";
import { useHentHistorikkNyFlyt } from "../../../../api/lydia-api/nyFlyt";
import { SamarbeidStatusBadge } from "../../../../components/Badge/SamarbeidStatusBadge";
import { IAProsessStatusBadge } from "../../../../components/Badge/IAProsessStatusBadge";
import { HistoriskTeamDropdown } from "../../../MineSaker/TeamDropdown";
import { Link } from "react-router-dom";
import { ClockDashedIcon } from "@navikt/aksel-icons";

export type SakshistorikkMedSamarbeidInnholdProps = {
    sakshistorikk?: Sakshistorikk[];
    lasterSakshistorikk: boolean;
    orgnr: string;
};

export default function SakshistorikkMedSamarbeidOgDatahenting({
    orgnr,
    Innhold = SakshistorikkMedSamarbeidWrapper,
}: {
    orgnr: string;
    Innhold?: React.ComponentType<SakshistorikkMedSamarbeidInnholdProps>;
}) {
    const { data: sakshistorikk, loading: lasterSakshistorikk } =
        useHentHistorikkNyFlyt(orgnr);

    return (
        <Innhold
            sakshistorikk={sakshistorikk}
            lasterSakshistorikk={lasterSakshistorikk}
            orgnr={orgnr}
        />
    );
}

function SakshistorikkMedSamarbeidWrapper({
    sakshistorikk,
    lasterSakshistorikk,
    orgnr,
}: SakshistorikkMedSamarbeidInnholdProps) {
    return (
        <div className={styles.samarbeidshistorikkfaneContainer}>
            <Heading level="3" size="large" spacing={true}>
                Historikk
            </Heading>
            <SakshistorikkMedSamarbeidInnhold
                sakshistorikk={sakshistorikk}
                lasterSakshistorikk={lasterSakshistorikk}
                orgnr={orgnr}
            />
        </div>
    );
}

export function SakshistorikkMedSamarbeidInnhold({
    sakshistorikk,
    lasterSakshistorikk,
    orgnr,
}: SakshistorikkMedSamarbeidInnholdProps) {
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
        samarbeid: sorterSamarbeidPåTid(historikk.samarbeid),
    }));

    return (
        <Tabs defaultValue={sortertHistorikk[0].saksnummer}>
            <Tabs.List>
                {sortertHistorikk.map((sakshistorikk) => (
                    <Tabs.Tab
                        key={sakshistorikk.saksnummer}
                        value={sakshistorikk.saksnummer}
                        icon={
                            <IAProsessStatusBadge
                                status={sakshistorikk.sakshendelser[0].status}
                            />
                        }
                        label={lokalDato(sakshistorikk.sistEndret)}
                    />
                ))}
            </Tabs.List>
            {sortertHistorikk.map((sakshistorikk) => (
                <Tabs.Panel
                    key={sakshistorikk.saksnummer}
                    value={sakshistorikk.saksnummer}
                >
                    <VStack
                        gap="space-16"
                        paddingBlock="space-16"
                        paddingInline="space-8"
                    >
                        <HStack
                            gap="space-16"
                            align="center"
                            justify="space-between"
                        >
                            <HStack gap="space-8" align="center">
                                <IAProsessStatusBadge
                                    status={
                                        sakshistorikk.sakshendelser[0].status
                                    }
                                />
                                <BodyShort>
                                    {lokalDato(sakshistorikk.opprettet)} -{" "}
                                    {lokalDato(sakshistorikk.sistEndret)}
                                </BodyShort>
                            </HStack>
                            <HStack gap="space-16" align="center" justify="end">
                                <Button
                                    as={Link}
                                    to={`/virksomhet/${orgnr}/sak/${sakshistorikk.saksnummer}`}
                                    variant="secondary"
                                    size="small"
                                    icon={<ClockDashedIcon aria-hidden />}
                                >
                                    Gå til samarbeidsperiode
                                </Button>
                                <HistoriskTeamDropdown
                                    sakshistorikk={sakshistorikk}
                                />
                            </HStack>
                        </HStack>
                        <LeveransehistorikkTabell
                            orgnr={orgnr}
                            saksnummer={sakshistorikk.saksnummer}
                        />
                        <SakshistorikkTabell
                            key={sakshistorikk.saksnummer}
                            sakshistorikk={sakshistorikk}
                            visHeading={false}
                        />
                        <SamarbeidAccordion
                            samarbeidshistorikk={sakshistorikk.samarbeid}
                            orgnr={orgnr}
                        />
                    </VStack>
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}

function SamarbeidAccordion({
    samarbeidshistorikk,
    orgnr,
}: {
    samarbeidshistorikk: Sakshistorikk["samarbeid"];
    orgnr: string;
}) {
    const samarbeidMedEkstradata =
        samarbeidshistorikk?.map((samarbeid) => ({
            ...samarbeid,
            startDato: samarbeid.opprettet ?? new Date(),
            sluttDato: samarbeid.sistEndret ?? new Date(),
        })) || [];
    return (
        <>
            <Heading size="small" level="3">
                Samarbeid
            </Heading>
            <Accordion>
                {samarbeidMedEkstradata.map((samarbeid, index) => (
                    <Accordion.Item key={index}>
                        <Accordion.Header
                            className={styles.accordionHeaderContent}
                        >
                            <SamarbeidStatusBadge status={samarbeid.status} />{" "}
                            {samarbeid.navn}
                        </Accordion.Header>
                        <Accordion.Content>
                            <Button
                                as={Link}
                                to={`/virksomhet/${orgnr}/sak/${samarbeid.saksnummer}/samarbeid/${samarbeid.id}`}
                                variant="secondary"
                                size="small"
                                icon={<ClockDashedIcon aria-hidden />}
                            >
                                Gå til samarbeid
                            </Button>
                            <BodyShort>
                                Startdato: {lokalDato(samarbeid.startDato)}
                            </BodyShort>
                            <BodyShort>
                                Sluttdato: {lokalDato(samarbeid.sluttDato)}
                            </BodyShort>
                            <BodyShort>[TABELL MED HISTORIKK]</BodyShort>
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    );
}

function sorterSakshistorikkPåTid({ sakshendelser }: Sakshistorikk) {
    for (const hendelse of sakshendelser) {
        if (!hendelse.tidspunktForSnapshot.getTime) {
            console.error(
                `Error: Sakshendelse mangler tidspunktForSnapshot: ${JSON.stringify(
                    hendelse,
                )}`,
            );
        }
    }

    return sakshendelser.sort(
        (a, b) =>
            new Date(b.tidspunktForSnapshot).getTime() -
            new Date(a.tidspunktForSnapshot).getTime(),
    );
}

function sorterSamarbeidPåTid(samarbeid: Sakshistorikk["samarbeid"]) {
    if (!samarbeid) {
        return [];
    }

    return samarbeid.sort(
        (a, b) =>
            new Date(b.opprettet ?? b.sistEndret ?? 0).getTime() -
            new Date(a.opprettet ?? a.sistEndret ?? 0).getTime(),
    );
}

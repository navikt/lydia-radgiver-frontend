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
import { IASamarbeidStatusType } from "../../../../domenetyper/iaSakProsess";
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
import { SamarbeidshistorikkTabell } from "./SamarbeidshistorikkTabell";

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
                        label={lokalDato(sakshistorikk.opprettet)}
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
                                <BodyShort>
                                    <b>Samarbeidsperiode: </b>
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
    return (
        <VStack
            gap="space-8"
            paddingInline="space-48 space-0"
            paddingBlock="space-24 space-0"
        >
            <Heading size="small" level="3">
                Samarbeid
            </Heading>
            <Accordion>
                {(samarbeidshistorikk ?? []).map((samarbeid) => (
                    <Accordion.Item key={samarbeid.id} data-color="neutral">
                        <Accordion.Header
                            className={styles.accordionHeaderContent}
                        >
                            <HStack
                                gap="space-16"
                                align="center"
                                justify="space-between"
                                width="100%"
                            >
                                {samarbeid.navn ?? "Samarbeid uten navn"}
                                <HStack gap="space-16" align="center">
                                    <BodyShort as="span">
                                        {datointervall(samarbeid)}
                                    </BodyShort>
                                    <SamarbeidStatusBadge
                                        status={samarbeid.status}
                                    />
                                </HStack>
                            </HStack>
                        </Accordion.Header>
                        <Accordion.Content>
                            <SamarbeidshistorikkTabell
                                orgnr={orgnr}
                                saksnummer={samarbeid.saksnummer}
                                samarbeidId={samarbeid.id}
                                samarbeidsnavn={samarbeid.navn}
                            />
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion>
        </VStack>
    );
}

function datointervall({
    status,
    opprettet,
    sistEndret,
}: {
    status: IASamarbeidStatusType;
    opprettet?: Date | null;
    sistEndret?: Date | null;
}) {
    const startdato = opprettet ? lokalDato(opprettet) : "";

    if (status === "AKTIV") {
        return startdato ? `${startdato} - Nåtid` : "Nåtid";
    }

    return `${startdato} - ${sistEndret ? lokalDato(sistEndret) : ""}`;
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

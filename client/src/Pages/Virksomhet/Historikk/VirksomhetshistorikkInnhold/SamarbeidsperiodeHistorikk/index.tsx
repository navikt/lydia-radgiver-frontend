import {
    Samarbeidsperiode,
    SamarbeidsperiodeHistorikk,
} from "../../../../../domenetyper/historikk";
import { useHentSamarbeidsperiodehistorikk } from "../../../../../api/lydia-api/nyFlyt";
import {
    Accordion,
    BodyShort,
    Button,
    Heading,
    HStack,
    Link,
    Loader,
    VStack,
} from "@navikt/ds-react";
import { SamarbeidsperiodeHistorikkTabell } from "./SamarbeidsperiodeHistorikkTabell";
import { IaSakProsess } from "../../../../../domenetyper/iaSakProsess";
import { LeveransehistorikkTabell } from "../../LeveransehistorikkTabell";
import styles from "./samarbeidsperiodehistorikk.module.scss";
import { SamarbeidshistorikkTabell } from "./SamarbeidshistorikkTabell";
import { SamarbeidStatusBadge } from "../../../../../components/Badge/SamarbeidStatusBadge";
import { lokalDato } from "../../../../../util/dato";
import { ClockDashedIcon } from "@navikt/aksel-icons";
import { HistoriskTeamDropdown } from "../../../../MineSaker/TeamDropdown";
import { useMemo } from "react";
import { sortertPå } from "../../../../../util/sortering";

export function SamarbeidsperiodeHistorikkMedDatahenting({
    orgnr,
    samarbeidsperiode,
}: {
    orgnr: string;
    samarbeidsperiode: Samarbeidsperiode;
}) {
    const {
        data: samarbeidsperiodehistorikk,
        loading: lasterSamarbeidsperiodehistorikk,
    } = useHentSamarbeidsperiodehistorikk({
        orgnummer: orgnr,
        saksnummer: samarbeidsperiode.saksnummer,
    });

    if (lasterSamarbeidsperiodehistorikk) {
        return <Loader />;
    }

    if (!samarbeidsperiodehistorikk) {
        return (
            <BodyShort>
                Kunne ikke hente historikk for samarbeidsperiode
            </BodyShort>
        );
    }

    return (
        <SamarbeidsperiodeHistorikkWrapper
            samarbeidsperiode={samarbeidsperiode}
            orgnr={orgnr}
            samarbeidsperiodehistorikk={samarbeidsperiodehistorikk}
        />
    );
}

function SamarbeidsperiodeHistorikkWrapper({
    orgnr,
    samarbeidsperiode,
    samarbeidsperiodehistorikk,
}: {
    orgnr: string;
    samarbeidsperiode: Samarbeidsperiode;
    samarbeidsperiodehistorikk: SamarbeidsperiodeHistorikk;
}) {
    const sortertSamarbeidsperiode = useMemo(() => {
        const sortertHistorikk = sortertPå(
            samarbeidsperiodehistorikk.historikkHendelser,
            (hendelse) => new Date(hendelse.tidspunkt).getTime(),
            true,
        );
        const sorterteSamarbeid = sortertPå(
            samarbeidsperiodehistorikk.samarbeid,
            (samarbeid) =>
                new Date(
                    samarbeid.opprettet ?? samarbeid.sistEndret ?? 0,
                ).getTime(),
            true,
        );
        return {
            ...samarbeidsperiodehistorikk,
            historikkHendelser: sortertHistorikk,
            samarbeid: sorterteSamarbeid,
        };
    }, [
        samarbeidsperiodehistorikk.historikkHendelser,
        samarbeidsperiodehistorikk.samarbeid,
    ]);

    return (
        <VStack gap="space-16" paddingBlock="space-16" paddingInline="space-8">
            <HStack gap="space-16" align="center" justify="space-between">
                <HStack gap="space-8" align="center">
                    <BodyShort>
                        <b>Samarbeidsperiode: </b>
                        {datointervall({
                            status: samarbeidsperiode.status,
                            opprettet: samarbeidsperiodehistorikk.opprettet,
                            sistEndret: samarbeidsperiodehistorikk.sistEndret,
                        })}
                    </BodyShort>
                </HStack>
                <HStack gap="space-16" align="center" justify="end">
                    <Button
                        as={Link}
                        to={`/virksomhet/${orgnr}/sak/${samarbeidsperiodehistorikk.saksnummer}`}
                        variant="secondary"
                        size="small"
                        icon={<ClockDashedIcon aria-hidden />}
                    >
                        Gå til samarbeidsperiode
                    </Button>
                    <HistoriskTeamDropdown
                        samarbeidsperiode={samarbeidsperiode}
                    />
                </HStack>
            </HStack>
            <LeveransehistorikkTabell
                orgnr={orgnr}
                saksnummer={samarbeidsperiodehistorikk.saksnummer}
            />
            <SamarbeidsperiodeHistorikkTabell
                samarbeidsperiode={sortertSamarbeidsperiode}
            />
            <SamarbeidAccordion
                samarbeid={sortertSamarbeidsperiode.samarbeid}
                orgnr={orgnr}
            />
        </VStack>
    );
}

function SamarbeidAccordion({
    samarbeid,
    orgnr,
}: {
    samarbeid: IaSakProsess[];
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
                {(samarbeid ?? []).map((samarbeid) => (
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
    status: string;
    opprettet?: Date | null;
    sistEndret?: Date | null;
}) {
    const startdato = opprettet ? lokalDato(opprettet) : "";

    if (status === "AKTIV") {
        return startdato ? `${startdato} - ` : "Nåtid";
    }

    return `${startdato} - ${sistEndret ? lokalDato(sistEndret) : ""}`;
}

import {
    Samarbeidsperiode,
    SamarbeidsperiodeHistorikk,
} from "../../../../../domenetyper/historikk";
import { useHentSamarbeidsperiodehistorikk } from "../../../../../api/lydia-api/nyFlyt";
import {
    BodyShort,
    Button,
    HStack,
    Link,
    Loader,
    VStack,
} from "@navikt/ds-react";
import { SamarbeidsperiodeHistorikkTabell } from "./SamarbeidsperiodeHistorikkTabell";
import { LeveransehistorikkTabell } from "../../LeveransehistorikkTabell";
import { datointervall } from "../../../../../util/dato";
import { ClockDashedIcon } from "@navikt/aksel-icons";
import { HistoriskTeamDropdown } from "../../../../MineSaker/TeamDropdown";
import { useMemo } from "react";
import { sortertPå } from "../../../../../util/sortering";
import { SamarbeidAccordion } from "./SamarbeidAccordion";

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
            <SamarbeidsperiodeHistorikkTabell
                samarbeidsperiode={sortertSamarbeidsperiode}
            />
            {sortertSamarbeidsperiode.samarbeid.length > 0 && (
                <SamarbeidAccordion
                    samarbeid={sortertSamarbeidsperiode.samarbeid}
                    orgnr={orgnr}
                />
            )}
            <LeveransehistorikkTabell
                orgnr={orgnr}
                saksnummer={samarbeidsperiodehistorikk.saksnummer}
            />
        </VStack>
    );
}

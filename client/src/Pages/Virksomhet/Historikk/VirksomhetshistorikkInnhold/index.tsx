import {
    BodyShort,
    Detail,
    Heading,
    HStack,
    Loader,
    Spacer,
    Tabs,
    TagProps,
    VStack,
} from "@navikt/ds-react";
import { lokalDato } from "../../../../util/dato";
import { useHentHistorikkForVirksomhet } from "../../../../api/lydia-api/nyFlyt";
import { IAProsessStatusBadge } from "../../../../components/Badge/IAProsessStatusBadge";
import {
    Historikklinje,
    Samarbeidsperiode,
    Virksomhetshistorikk,
} from "../../../../domenetyper/historikk";
import styles from "./sykefraværshistorikkinnhold.module.scss";
import { sortertPå } from "../../../../util/sortering";
import { useEffect, useMemo, useState } from "react";
import { SamarbeidsperiodeHistorikkMedDatahenting } from "./SamarbeidsperiodeHistorikk";
import {
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../domenetyper/domenetyper";
import { GenericStatusBadge } from "../../../../components/Badge/StatusBadge";
import NavIdentMedFallback from "../../../../components/NavIdentMedFallback";

export type VirksomhetshistorikkWrapperProps = {
    virksomhetshistorikk?: Virksomhetshistorikk;
    lasterVirksomhetshistorikk: boolean;
    orgnr: string;
};

export default function VirksomhetshistorikkMedDatahenting({
    orgnr,
}: {
    orgnr: string;
}) {
    const { data: virksomhetshistorikk, loading: lasterVirksomhetshistorikk } =
        useHentHistorikkForVirksomhet(orgnr);

    return (
        <div className={styles.samarbeidshistorikkfaneContainer}>
            <Heading level="3" size="large" spacing={true}>
                Historikk v2
            </Heading>
            <VirksomhetshistorikkInnhold
                virksomhetshistorikk={virksomhetshistorikk}
                lasterVirksomhetshistorikk={lasterVirksomhetshistorikk}
                orgnr={orgnr}
            />
        </div>
    );
}

export function VirksomhetshistorikkInnhold({
    virksomhetshistorikk,
    lasterVirksomhetshistorikk,
    orgnr,
}: VirksomhetshistorikkWrapperProps) {
    if (lasterVirksomhetshistorikk) {
        return <Loader />;
    }

    if (!virksomhetshistorikk) {
        return <BodyShort>Kunne ikke hente virksomhetshistorikk</BodyShort>;
    }

    if (virksomhetshistorikk.samarbeidsperioder.length === 0) {
        return (
            <BodyShort>
                Fant ingen samarbeidsperioder på denne virksomheten.
            </BodyShort>
        );
    }

    const sortertHistorikk: Virksomhetshistorikk = useMemo(
        () => ({
            hendelser: sorterHistorikklinjerPåTid(
                virksomhetshistorikk.hendelser,
            ),
            samarbeidsperioder: sorterSamarbeidsperioderPåTid(
                virksomhetshistorikk.samarbeidsperioder,
            ),
        }),
        [virksomhetshistorikk],
    );

    const [tab, velgTab] = useState(
        sortertHistorikk.samarbeidsperioder[0].saksnummer,
    );

    useEffect(() => {
        velgTab(sortertHistorikk.samarbeidsperioder[0].saksnummer);
    }, [sortertHistorikk]);

    return (
        <VStack gap="space-64">
            {!!sortertHistorikk.hendelser.length && (
                <VirksomhetshistorikkLinjeTabell
                    linjer={sortertHistorikk.hendelser}
                />
            )}
            <Tabs value={tab} onChange={velgTab}>
                <Tabs.List>
                    {sortertHistorikk.samarbeidsperioder.map(
                        (samarbeidsperiode) => (
                            <Tabs.Tab
                                key={samarbeidsperiode.saksnummer}
                                value={samarbeidsperiode.saksnummer}
                                className={styles.samarbeidsperiodeTab}
                                icon={
                                    <IAProsessStatusBadge
                                        status={samarbeidsperiode.status}
                                        className={styles.badge}
                                    />
                                }
                                label={lokalDato(samarbeidsperiode.fraDato)}
                            />
                        ),
                    )}
                </Tabs.List>
                {sortertHistorikk.samarbeidsperioder.map(
                    (samarbeidsperiode) => (
                        <Tabs.Panel
                            key={samarbeidsperiode.saksnummer}
                            value={samarbeidsperiode.saksnummer}
                        >
                            <SamarbeidsperiodeHistorikkMedDatahenting
                                key={samarbeidsperiode.saksnummer}
                                orgnr={orgnr}
                                samarbeidsperiode={samarbeidsperiode}
                            />
                        </Tabs.Panel>
                    ),
                )}
            </Tabs>
        </VStack>
    );
}
function VirksomhetshistorikkLinjeTabell({
    linjer,
}: {
    linjer: Historikklinje[];
}) {
    return (
        <VStack gap="space-16">
            {linjer.map((linje) => (
                <HStack
                    key={linje.relatert_hendelse?.hendelse_id}
                    align="center"
                    gap="space-24"
                    wrap={false}
                >
                    <HendelsesBadge
                        hendelsetype={linje.relatert_hendelse?.hendelsetype}
                    />
                    <Detail>{linje.beskrivelse}</Detail>
                    <Spacer />
                    <Detail>
                        {linje.tidspunkt ? lokalDato(linje.tidspunkt) : ""}
                    </Detail>
                    <NavIdentMedFallback
                        navIdent={
                            linje.relatert_hendelse?.hendelse_opprettet_av
                        }
                    />
                    <Spacer />
                </HStack>
            ))}
        </VStack>
    );
}

function HendelsesBadge({
    hendelsetype,
}: {
    hendelsetype?: IASakshendelseType;
}) {
    return hendelsetype ? (
        <GenericStatusBadge
            status={hendelsetype}
            penskrivStatus={penskrivStatus}
            {...hentTagPropsForHendelsetype(hendelsetype)}
        />
    ) : (
        <GenericStatusBadge status={""} penskrivStatus={() => ""} />
    );
}

const penskrivStatus = (hendelsetype: IASakshendelseType) => {
    switch (hendelsetype) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_AVREGISTRERT:
            return "Slettet";
    }
    return hendelsetype;
};

export function hentTagPropsForHendelsetype(
    status: IASakshendelseType,
): Partial<TagProps> {
    switch (status) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_AVREGISTRERT:
            return { variant: "strong", "data-color": "danger" };
        default:
            return {};
    }
}

function sorterHistorikklinjerPåTid(hendelser: Historikklinje[]) {
    return sortertPå(
        hendelser,
        (hendelse) =>
            hendelse.tidspunkt
                ? new Date(hendelse.tidspunkt).getTime()
                : undefined,
        true,
    );
}

function sorterSamarbeidsperioderPåTid(samarbeid: Samarbeidsperiode[]) {
    return sortertPå(
        samarbeid,
        (samarbeid) => new Date(samarbeid.fraDato).getTime(),
        true,
    );
}

import React, { useRef, useState } from "react";
import {
    BodyShort,
    Button,
    ButtonProps,
    Heading,
    HStack,
    Popover,
    Skeleton,
    Tabs,
    VStack,
} from "@navikt/ds-react";
import {
    ClockIcon,
    InformationSquareIcon,
    TrendUpIcon,
} from "@navikt/aksel-icons";

import { VirksomhetsInfoPopoverInnhold } from "./VirksomhetsInfoPopoverInnhold";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";
import { EksternLenke } from "../../../../components/EksternLenke";

import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { loggÅpnetVirksomhetsinfo } from "../../../../util/analytics-klient";
import { InternLenke } from "../../../../components/InternLenke";
import { useErPåInaktivSak } from "../../../Virksomhet/VirksomhetContext";

import styles from "./virksomhetsinfoheader.module.scss";
import Sakshistorikkmodal from "../../../Virksomhet/Sakshistorikk/SakshistorikkInnhold/Sakshistorikkmodal";
import Sykefraværsstatistikkmodal from "../../../Virksomhet/Statistikk/Sykefraværsstatistikkmodal";
import { lokalDato } from "../../../../util/dato";
import {
    useHentTilstandForVirksomhetNyFlyt,
    vurderSakNyFlyt,
} from "../../../../api/lydia-api/nyFlyt";
import { useOversiktMutate } from "../../Debugside/Oversikt";

export default function VirksomhetOgSamarbeidsHeader({
    virksomhet,
    iaSak,
    valgtSamarbeid,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    valgtSamarbeid?: IaSakProsess;
}) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [openState, setOpenState] = useState(false);

    const erPåInaktivSak = useErPåInaktivSak();

    return (
        <>
            <div className={styles.virksomhetOgSamarbeidsHeader}>
                <VStack gap={"10"}>
                    <Topplinje
                        virksomhet={virksomhet}
                        iaSak={iaSak}
                        samarbeid={valgtSamarbeid}
                    />
                    {/* <HStack gap={"4"}>
                        <SaksgangDropdown
                            virksomhet={virksomhet}
                            iaSak={iaSak}
                        />
                        <EierskapKnapp iaSak={iaSak} />
                        {salesforceInfo && (
                            <EksternLenke
                                className={styles.salesforceLenke}
                                href={salesforceInfo?.url}
                            >
                                Salesforce - virksomhet
                            </EksternLenke>
                        )}
                    </HStack> */}
                    <HStack align={"center"} width={"100%"}>
                        <HStack
                            gap={"4"}
                            align={"center"}
                            justify={"space-between"}
                            width={"100%"}
                        >
                            <HStack gap={"2"} align={"center"}>
                                <Button
                                    className={styles.invisibleButton}
                                    size="xsmall"
                                    variant="tertiary-neutral"
                                    ref={buttonRef}
                                    onClick={() => {
                                        setOpenState(!openState);
                                        if (!openState) {
                                            loggÅpnetVirksomhetsinfo();
                                        }
                                    }}
                                    aria-label="Se detaljer"
                                >
                                    <InformationSquareIcon
                                        className={styles.virksomhetsInfoIkon}
                                        fontSize="2rem"
                                        aria-hidden
                                    />
                                </Button>
                                <Heading
                                    as={InternLenke}
                                    level={"1"}
                                    size={"large"}
                                    variant={"neutral"}
                                    href={`/virksomhet/${virksomhet.orgnr}`}
                                    title="Gå til virksomhet"
                                >
                                    {virksomhet.navn}
                                </Heading>
                            </HStack>
                            <HistorikkStatistikkKnapper
                                valgtSamarbeid={valgtSamarbeid}
                                virksomhet={virksomhet}
                            />
                        </HStack>
                        <Popover
                            open={openState}
                            placement="right-start"
                            onClose={() => setOpenState(false)}
                            anchorEl={buttonRef.current}
                            style={{ overflow: "auto" }}
                        >
                            <VirksomhetsInfoPopoverInnhold
                                iaSak={iaSak}
                                virksomhet={virksomhet}
                            />
                        </Popover>
                    </HStack>
                </VStack>
            </div>
            {erPåInaktivSak && iaSak && (
                <DuErPåGammelPeriode iaSak={iaSak} virksomhet={virksomhet} />
            )}
        </>
    );
}

function Topplinje({
    virksomhet,
    /* iaSak,
    samarbeid, */
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    samarbeid?: IaSakProsess;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const [error, setError] = useState<string | null>(null);
    const [lasterHandling, setLasterHandling] = useState(false);
    const { data: tilstand, loading: tilstandLoading } =
        useHentTilstandForVirksomhetNyFlyt(virksomhet.orgnr);

    if (error) {
        return <HStack gap="4">ERROR: {error}</HStack>;
    }

    if (tilstandLoading) {
        // TODO: Pen loading
        return (
            <HStack gap={"4"}>
                <Skeleton width={100} />
                <Skeleton width={60} />
                <Salesforcelenke orgnr={virksomhet.orgnr} />
            </HStack>
        );
    }

    if (tilstand?.tilstand === "VirksomhetKlarTilVurdering") {
        const handleSubmit = async () => {
            setError(null);
            setLasterHandling(true);
            try {
                await vurderSakNyFlyt(virksomhet.orgnr);
                setLasterHandling(false);
                mutate();
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
                setLasterHandling(false);
            }
        };
        return (
            <HStack gap={"4"}>
                <Button
                    onClick={handleSubmit}
                    disabled={lasterHandling}
                    loading={lasterHandling}
                    size="small"
                >
                    Vurder virksomheten
                </Button>
                {/* <EierskapKnapp iaSak={iaSak} /> */}
                <Salesforcelenke orgnr={virksomhet.orgnr} />
            </HStack>
        );
    }

    return "Ikke implementert";
}

function Salesforcelenke({ orgnr }: { orgnr: string }) {
    const { data: salesforceInfo } = useHentSalesforceUrl(orgnr);

    if (salesforceInfo) {
        return (
            <EksternLenke
                className={styles.salesforceLenke}
                href={salesforceInfo?.url}
            >
                Salesforce - virksomhet
            </EksternLenke>
        );
    }
}

function DuErPåGammelPeriode({
    iaSak,
    virksomhet,
}: {
    iaSak: IASak;
    virksomhet: Virksomhet;
}) {
    // TODO: Bruk fornuftig dato her.
    const startDato = iaSak?.opprettetTidspunkt
        ? lokalDato(iaSak?.opprettetTidspunkt)
        : "DATO";
    const sluttDato = iaSak?.endretTidspunkt
        ? lokalDato(iaSak?.endretTidspunkt)
        : "DATO";

    const harAktivIASak =
        virksomhet.aktivtSaksnummer &&
        virksomhet.aktivtSaksnummer !== iaSak.saksnummer;

    return (
        <HStack
            gap="4"
            align="center"
            justify="space-between"
            className={styles.duErPåGammelPeriodeBanner}
        >
            <BodyShort>
                <b>Du er på en tidligere samarbeidsperiode</b> {startDato} -{" "}
                {sluttDato}
            </BodyShort>
            {harAktivIASak && (
                <Button
                    as="a"
                    href={`/virksomhet/${iaSak?.orgnr}`}
                    size="small"
                >
                    Gå til aktiv periode
                </Button>
            )}
        </HStack>
    );
}

function HistorikkStatistikkKnapper({
    valgtSamarbeid,
    virksomhet,
}: {
    valgtSamarbeid?: IaSakProsess;
    virksomhet: Virksomhet;
}) {
    if (valgtSamarbeid) {
        return (
            <HStack gap="4" justify="end">
                <Sykefraværsstatistikkmodal
                    className={styles.tabButton}
                    virksomhet={virksomhet}
                />
                <Sakshistorikkmodal
                    className={styles.tabButton}
                    orgnr={virksomhet.orgnr}
                    virksomhetsnavn={virksomhet.navn}
                />
            </HStack>
        );
    }

    return (
        <>
            <HStack gap="4" justify="end" role="tablist">
                <Tabs.Tab
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    as={({ className, ...remainingProps }: ButtonProps) => (
                        <Button
                            {...remainingProps}
                            className={styles.tabButton}
                        />
                    )}
                    variant="tertiary"
                    size="small"
                    value="statistikk"
                    label="Sykefraværsstatistikk"
                    icon={<TrendUpIcon aria-hidden fontSize="1.25rem" />}
                />
                <Tabs.Tab
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    as={({ className, ...remainingProps }: ButtonProps) => (
                        <Button
                            {...remainingProps}
                            className={styles.tabButton}
                        />
                    )}
                    variant="tertiary"
                    size="small"
                    value="historikk"
                    label="Historikk"
                    icon={<ClockIcon aria-hidden fontSize="1.25rem" />}
                />
            </HStack>
        </>
    );
}

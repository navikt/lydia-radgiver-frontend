import React, { useRef, useState } from "react";
import {
    BodyShort,
    Button,
    ButtonProps,
    Heading,
    HStack,
    Popover,
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

import { SaksgangDropdown } from "./SaksgangDropdown";
import { EierskapKnapp } from "../../../Virksomhet/Samarbeid/EierskapKnapp";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { loggÅpnetVirksomhetsinfo } from "../../../../util/analytics-klient";
import { InternLenke } from "../../../../components/InternLenke";
import { useErPåInaktivSak } from "../../../Virksomhet/VirksomhetContext";

import styles from "./virksomhetsinfoheader.module.scss";
import Sakshistorikkmodal from "../../../Virksomhet/Sakshistorikk/SakshistorikkInnhold/Sakshistorikkmodal";
import Sykefraværsstatistikkmodal from "../../Statistikk/Sykefraværsstatistikkmodal";
import { lokalDato } from "../../../../util/dato";

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
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    const erPåInaktivSak = useErPåInaktivSak();

    return (
        <>
            <div className={styles.virksomhetOgSamarbeidsHeader}>
                <VStack gap={"10"}>
                    <HStack gap={"4"}>
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
                    </HStack>
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

import React, { useRef, useState } from "react";
import {
    Alert,
    Button,
    Heading,
    HStack,
    Popover,
    Tabs,
    VStack,
} from "@navikt/ds-react";
import { ClockIcon, InformationSquareIcon, TrendUpIcon } from "@navikt/aksel-icons";

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
            {erPåInaktivSak && (
                <Alert variant="info" className={styles.arkivertSakAlert}>
                    Denne saken er arkivert.
                </Alert>
            )}
            <div className={styles.virksomhetOgSamarbeidsHeader}>
                <VStack gap={"10"}>
                    <HStack justify="space-between" align="start">
                        <HStack gap={"4"}>
                            <SaksgangDropdown
                                virksomhet={virksomhet}
                                iaSak={iaSak}
                            />
                            <EierskapKnapp iaSak={iaSak} />
                        </HStack>
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
                        <HStack gap={"4"} align={"center"} justify={"space-between"} width={"100%"}>
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
                                        className={
                                            styles.virksomhetsInfoIkon
                                        }
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
                            <HistorikkStatistikkKnapper valgtSamarbeid={valgtSamarbeid} virksomhet={virksomhet} />
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
        </>
    );
}


function HistorikkStatistikkKnapper({ valgtSamarbeid, virksomhet }: { valgtSamarbeid?: IaSakProsess, virksomhet: Virksomhet }) {
    if (valgtSamarbeid) {
        return (
            <HStack gap="4" justify="end">
                <Sykefraværsstatistikkmodal virksomhet={virksomhet} />
                <Sakshistorikkmodal orgnr={virksomhet.orgnr} virksomhetsnavn={virksomhet.navn} />
            </HStack>
        );
    }

    return (
        <>
            <HStack gap="4" justify="end">
                <Tabs.Tab
                    as={Button}
                    variant="tertiary"
                    size="small"
                    value="statistikk"
                    label="Sykefraværsstatistikk"
                    icon={<TrendUpIcon aria-hidden fontSize="1.25rem" />}
                />
                <Tabs.Tab
                    as={Button}
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
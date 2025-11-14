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
import { ChevronRightIcon, InformationSquareIcon } from "@navikt/aksel-icons";

import { VirksomhetsInfoPopoverInnhold } from "../../../Virksomhet/Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetsInfoPopoverInnhold";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";
import { EksternLenke } from "../../../../components/EksternLenke";

import { SaksgangDropdown } from "../../../Virksomhet/Virksomhetsoversikt/VirksomhetsinfoHeader/SaksgangDropdown";
import { EierskapKnapp } from "../../../Virksomhet/Samarbeid/EierskapKnapp";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { loggÅpnetVirksomhetsinfo } from "../../../../util/analytics-klient";
import { useHentBrukerinformasjon } from "../../../../api/lydia-api/bruker";
import { NyttSamarbeidModal } from "../../../Virksomhet/Samarbeid/NyttSamarbeidModal";
import { VisHvisSamarbeidErLukket } from "../../../Virksomhet/Samarbeid/SamarbeidContext";
import { InternLenke } from "../../../../components/InternLenke";
import { useErPåInaktivSak } from "../../../Virksomhet/VirksomhetContext";
import { SamarbeidStatusBadge } from "../../../../components/Badge/SamarbeidStatusBadge";

import styles from "./virksomhetsinfoheader.module.scss";
import { useHentTeam } from "../../../../api/lydia-api/team";
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
    const [nyttSamarbeidModalÅpen, setNyttSamarbeidModalÅpen] = useState(false);
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const kanEndreSamarbeid = brukerFølgerSak || brukerErEierAvSak;

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
                            {/* <SamarbeidsDropdown
                                iaSak={iaSak}
                                virksomhet={virksomhet}
                                setNyttSamarbeidModalÅpen={
                                    setNyttSamarbeidModalÅpen
                                }
                            /> */}
                            <SaksgangDropdown
                                virksomhet={virksomhet}
                                iaSak={iaSak}
                                setNyttSamarbeidModalÅpen={
                                    setNyttSamarbeidModalÅpen
                                }
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
                    <HStack align={"center"}>
                        <VStack>
                            <HStack gap={"2"} align={"center"}>
                                {valgtSamarbeid === undefined && (
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
                                )}
                                <Heading
                                    as={InternLenke}
                                    level={"1"}
                                    size={"large"}
                                    variant={"neutral"}
                                    href={`/virksomhetNy/${virksomhet.orgnr}`}
                                    title="Gå til virksomhet"
                                >
                                    {virksomhet.navn}
                                </Heading>

                                {valgtSamarbeid && (
                                    <>
                                        <ChevronRightIcon
                                            fontSize="2rem"
                                            aria-hidden
                                        />
                                        <Heading level={"1"} size={"large"}>
                                            {valgtSamarbeid.navn}
                                        </Heading>
                                        <VisHvisSamarbeidErLukket>
                                            <SamarbeidStatusBadge
                                                status={
                                                    valgtSamarbeid.status
                                                }
                                            />
                                        </VisHvisSamarbeidErLukket>
                                    </>
                                )}
                            </HStack>
                        </VStack>
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
                    <HistorikkStatistikkKnapper valgtSamarbeid={valgtSamarbeid} virksomhet={virksomhet} />
                </VStack>
                {iaSak && kanEndreSamarbeid && (
                    <NyttSamarbeidModal
                        iaSak={iaSak}
                        virksomhet={virksomhet}
                        åpen={nyttSamarbeidModalÅpen}
                        setÅpen={setNyttSamarbeidModalÅpen}
                    />
                )}
            </div>
        </>
    );
}


function HistorikkStatistikkKnapper({ valgtSamarbeid, virksomhet }: { valgtSamarbeid?: IaSakProsess, virksomhet: Virksomhet }) {
    if (valgtSamarbeid) {
        return (
            <HStack gap="4" justify="end">
                <Sakshistorikkmodal orgnr={virksomhet.orgnr} virksomhetsnavn={virksomhet.navn} />
                <Sykefraværsstatistikkmodal virksomhet={virksomhet} />
            </HStack>
        );
    }

    return (
        <Tabs.List>
            <HStack gap="4" justify="end">
                <Tabs.Tab
                    as={Button}
                    variant="secondary"
                    size="small"
                    value="statistikk"
                    label="Sykefraværsstatistikk"
                />
                <Tabs.Tab
                    as={Button}
                    variant="secondary"
                    size="small"
                    value="historikk"
                    label="Historikk"
                />
            </HStack>
        </Tabs.List>
    );
}
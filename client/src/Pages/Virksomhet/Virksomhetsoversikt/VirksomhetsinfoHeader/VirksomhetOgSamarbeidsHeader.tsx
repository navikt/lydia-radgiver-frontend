import React, { useRef, useState } from "react";
import {
    Alert,
    Button,
    Heading,
    HStack,
    Popover,
    VStack,
} from "@navikt/ds-react";
import { ChevronRightIcon, InformationSquareIcon } from "@navikt/aksel-icons";

import { VirksomhetsInfoPopoverInnhold } from "./VirksomhetsInfoPopoverInnhold";
import { useHentSalesforceUrl } from "../../../../api/lydia-api/virksomhet";
import { EksternLenke } from "../../../../components/EksternLenke";

import { SamarbeidsDropdown } from "../../Samarbeid/SamarbeidsDropdown";
import { SaksgangDropdown } from "./SaksgangDropdown";
import { EierskapKnapp } from "../../Samarbeid/EierskapKnapp";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { IASak } from "../../../../domenetyper/domenetyper";
import {
    IaSakProsess,
} from "../../../../domenetyper/iaSakProsess";
import { loggÅpnetVirksomhetsinfo } from "../../../../util/amplitude-klient";
import { useHentBrukerinformasjon } from "../../../../api/lydia-api/bruker";
import { NyttSamarbeidModal } from "../../Samarbeid/NyttSamarbeidModal";
import { VisHvisSamarbeidErLukket } from "../../Samarbeid/SamarbeidContext";
import { InternLenke } from "../../../../components/InternLenke";
import { useErPåInaktivSak } from "../../VirksomhetContext";
import { SamarbeidStatusBadge } from "../../../../components/Badge/SamarbeidStatusBadge";

import styles from "./virksomhetsinfoheader.module.scss";

export default function VirksomhetOgSamarbeidsHeader({
    virksomhet,
    iaSak,
    gjeldendeSamarbeid,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    gjeldendeSamarbeid?: IaSakProsess;
}) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [openState, setOpenState] = useState(false);
    const [nyttSamarbeidModalÅpen, setNyttSamarbeidModalÅpen] = useState(false);
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;

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
                            <SamarbeidsDropdown
                                iaSak={iaSak}
                                virksomhet={virksomhet}
                                setNyttSamarbeidModalÅpen={
                                    setNyttSamarbeidModalÅpen
                                }
                            />
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
                            <EksternLenke className={styles.salesforceLenke} href={salesforceInfo?.url}>
                                Salesforce - virksomhet
                            </EksternLenke>
                        )}
                    </HStack>
                    <HStack align={"center"}>
                        <VStack>
                            <HStack gap={"2"} align={"center"}>
                                {gjeldendeSamarbeid === undefined && (
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
                                )}
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

                                {gjeldendeSamarbeid && (
                                    <>
                                        <ChevronRightIcon
                                            fontSize="2rem"
                                            aria-hidden
                                        />
                                        <Heading level={"1"} size={"large"}>
                                            {gjeldendeSamarbeid.navn}
                                        </Heading>
                                        <VisHvisSamarbeidErLukket>
                                            <SamarbeidStatusBadge
                                                status={
                                                    gjeldendeSamarbeid.status
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
                </VStack>
                {iaSak && brukerErEierAvSak && (
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

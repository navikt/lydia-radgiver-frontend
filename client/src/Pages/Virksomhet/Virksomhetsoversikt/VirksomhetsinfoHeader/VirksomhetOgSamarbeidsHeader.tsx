import React, { useRef, useState } from "react";
import styled from "styled-components";

import { Alert, Button, Heading, HStack, Popover, Tag, VStack } from "@navikt/ds-react";
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
    defaultNavnHvisTomt,
    IaSakProsess,
} from "../../../../domenetyper/iaSakProsess";
import { loggÅpnetVirksomhetsinfo } from "../../../../util/amplitude-klient";
import { useHentBrukerinformasjon } from "../../../../api/lydia-api/bruker";
import { NyttSamarbeidModal } from "../../Samarbeid/NyttSamarbeidModal";
import { VisHvisSamarbeidErLukket } from "../../Samarbeid/SamarbeidContext";
import capitalizeFirstLetterLowercaseRest from "../../../../util/formatering/capitalizeFirstLetterLowercaseRest";
import { InternLenke } from "../../../../components/InternLenke";
import { useErPåInaktivSak } from "../../VirksomhetContext";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    gap: 0.75rem;
`;

const SalesforceLenke = styled(EksternLenke)`
    font-size: 1.125rem;
`;

const VirksomhetsInfoIkon = styled(InformationSquareIcon)`
    display: flex;
    cursor: pointer;
`;

const InvisibleButton = styled(Button).attrs({ size: "xsmall", variant: "tertiary-neutral" })`
    background-color: transparent;
    border: none;
    padding: 0;
`;

const StyledAlert = styled(Alert)`
    margin-bottom: 2rem;

    --a-surface-info-subtle: var(--a-gray-300);
    --a-border-info: var(--a-gray-600);
    --a-icon-info: var(--a-gray-600);
`;

export default function VirksomhetOgSamarbeidsHeader({
    virksomhet,
    iaSak,
    gjeldendeSamarbeid
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
            {
                erPåInaktivSak && (
                    <StyledAlert variant="info">
                        Denne saken er arkivert.
                    </StyledAlert>
                )
            }
            <Container>
                <VStack gap={"10"}>
                    <HStack justify="space-between" align="start">
                        <HStack gap={"4"}>
                            <SamarbeidsDropdown
                                iaSak={iaSak}
                                virksomhet={virksomhet}
                                setNyttSamarbeidModalÅpen={setNyttSamarbeidModalÅpen}
                            />
                            <SaksgangDropdown
                                virksomhet={virksomhet}
                                iaSak={iaSak}
                                setNyttSamarbeidModalÅpen={setNyttSamarbeidModalÅpen}
                            />
                            <EierskapKnapp iaSak={iaSak} />
                        </HStack>
                        {salesforceInfo && (
                            <SalesforceLenke href={salesforceInfo?.url}>
                                Salesforce
                            </SalesforceLenke>
                        )}
                    </HStack>
                    <HStack align={"center"}>
                        <VStack>
                            <HStack gap={"2"} align={"center"}>
                                {gjeldendeSamarbeid === undefined && (
                                    <InvisibleButton
                                        ref={buttonRef}
                                        onClick={() => {
                                            setOpenState(!openState);
                                            if (!openState) {
                                                loggÅpnetVirksomhetsinfo();
                                            }
                                        }}
                                        aria-label="Se detaljer"
                                    >
                                        <VirksomhetsInfoIkon
                                            fontSize="2rem"
                                            aria-hidden
                                        />
                                    </InvisibleButton>
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
                                        <ChevronRightIcon fontSize="2rem" aria-hidden />
                                        <Heading level={"1"} size={"large"}>
                                            {defaultNavnHvisTomt(
                                                gjeldendeSamarbeid.navn,
                                            )}
                                        </Heading>
                                        <VisHvisSamarbeidErLukket>
                                            <FullførtTag variant="success-moderate" size="small">
                                                {capitalizeFirstLetterLowercaseRest(gjeldendeSamarbeid.status)}
                                            </FullførtTag>
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
            </Container>
        </>
    );
}

const FullførtTag = styled(Tag)`
            margin-left: 0.5rem;
            `;
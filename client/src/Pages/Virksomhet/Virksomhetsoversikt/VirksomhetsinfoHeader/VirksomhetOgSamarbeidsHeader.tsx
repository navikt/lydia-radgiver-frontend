import React, { useRef, useState } from "react";
import styled from "styled-components";

import {
    Detail,
    Heading,
    HStack,
    Link,
    Popover,
    VStack,
} from "@navikt/ds-react";
import { ChevronRightIcon, InformationSquareIcon } from "@navikt/aksel-icons";

import { VirksomhetsInfoPopoverInnhold } from "./VirksomhetsInfoPopoverInnhold";
import {
    useHentSalesforceUrl,
    useHentSamarbeid,
} from "../../../../api/lydia-api";
import { EksternLenke } from "../../../../components/EksternLenke";

import { SamarbeidsDropdown } from "../../Samarbeid/SamarbeidsDropdown";
import { EndreStatusKnapp } from "./EndreStatusKnapp";
import { EierskapKnapp } from "../../Samarbeid/EierskapKnapp";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";

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
    margin-right: 0.5rem;
    cursor: pointer;
`;

export default function VirksomhetOgSamarbeidsHeader({
    virksomhet,
    iaSak,
    gjeldendeSamarbeid,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    gjeldendeSamarbeid?: IaSakProsess;
}) {
    const buttonRef = useRef<SVGSVGElement>(null);
    const [openState, setOpenState] = useState(false);
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    const { data: alleSamarbeid } = useHentSamarbeid(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );

    return (
        <Container>
            <VStack gap={"10"}>
                <HStack justify="space-between" align="start">
                    <HStack gap={"4"}>
                        <SamarbeidsDropdown
                            iaSak={iaSak}
                            virksomhet={virksomhet}
                        />
                        <EndreStatusKnapp
                            virksomhet={virksomhet}
                            iaSak={iaSak}
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
                            <Heading
                                as={Link}
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
                                    <ChevronRightIcon fontSize="2rem" />
                                    <Heading level={"1"} size={"large"}>
                                        {gjeldendeSamarbeid.navn ||
                                            "Samarbeid uten navn"}
                                    </Heading>
                                </>
                            )}
                            {gjeldendeSamarbeid === undefined && (
                                <VirksomhetsInfoIkon
                                    title={"Se detaljer"}
                                    ref={buttonRef}
                                    onClick={() => setOpenState(!openState)}
                                    fontSize="2rem"
                                />
                            )}
                        </HStack>

                        {alleSamarbeid !== undefined && (
                            <Detail>
                                {alleSamarbeid.length >= 1
                                    ? alleSamarbeid.length
                                    : "Ingen"}{" "}
                                samarbeid
                            </Detail>
                        )}
                    </VStack>

                    <Popover
                        open={openState}
                        placement="right-start"
                        onClose={() => setOpenState(false)}
                        anchorEl={buttonRef.current}
                    >
                        <VirksomhetsInfoPopoverInnhold
                            iaSak={iaSak}
                            virksomhet={virksomhet}
                        />
                    </Popover>
                </HStack>
            </VStack>
        </Container>
    );
}
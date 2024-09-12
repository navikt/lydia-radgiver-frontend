import React, { useRef, useState } from "react";
import { useHentSalesforceUrl } from "../../../api/lydia-api";
import { Heading, HStack, Link, Popover, VStack } from "@navikt/ds-react";
import { SamarbeidsDropdown } from "./SamarbeidsDropdown";
import { VirksomhetsInfoPopoverInnhold } from "../Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetsInfoPopoverInnhold";
import styled from "styled-components";
import { ChevronRightIcon, InformationSquareIcon } from "@navikt/aksel-icons";
import {
    contentSpacing,
    strekkBakgrunnenHeltUtTilKantenAvSida,
} from "../../../styling/contentSpacing";
import { NavFarger } from "../../../styling/farger";
import { EksternLenke } from "../../../components/EksternLenke";
import { NyEierskapKnapp } from "./NyEierskapKnapp";

import { Statusseksjon } from "../Virksomhetsoversikt/VirksomhetsinfoHeader/Statusseksjon";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { IASak } from "../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const VirksomhetsInfoIkon = styled(InformationSquareIcon)`
    display: flex;
    margin-right: 0.5rem;
    cursor: pointer;
`;

const Container = styled.div`
    padding-top: ${contentSpacing.mobileY};

    background-color: ${NavFarger.white};
    ${strekkBakgrunnenHeltUtTilKantenAvSida} // Velger å sette denne, da heading bruker xlarge, selv om vi setter dem til å være large.
    --a-font-size-heading-xlarge: 1.75rem;
`;

const SalesforceLenke = styled(EksternLenke)`
    font-size: 1.125rem;
`;

export function Samarbeidsoversikt({
    virksomhet,
    iaSak,
    gjeldendeSamarbeid,
}: {
    virksomhet: Virksomhet;
    iaSak: IASak;
    gjeldendeSamarbeid: IaSakProsess;
}) {
    const buttonRef = useRef<SVGSVGElement>(null);
    const [openState, setOpenState] = useState(false);
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    return (
        gjeldendeSamarbeid && (
            <Container>
                <VStack gap={"10"}>
                    <HStack justify="space-between" align="start">
                        <HStack gap={"8"}>
                            <SamarbeidsDropdown
                                iaSak={iaSak}
                                virksomhet={virksomhet}
                            />
                            <Statusseksjon iaSak={iaSak} />
                            <NyEierskapKnapp iaSak={iaSak} />
                        </HStack>
                        {salesforceInfo && (
                            <SalesforceLenke href={salesforceInfo?.url}>
                                Salesforce
                            </SalesforceLenke>
                        )}
                    </HStack>
                    <HStack align={"center"}>
                        <VirksomhetsInfoIkon
                            title={"Se detaljer"}
                            ref={buttonRef}
                            onClick={() => setOpenState(!openState)}
                            fontSize="2rem"
                        />
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
                            <ChevronRightIcon fontSize="2rem" />
                            <Heading level={"1"} size={"large"} color={"blue"}>
                                {gjeldendeSamarbeid.navn ||
                                    "Samarbeid uten navn"}
                            </Heading>
                        </HStack>
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
        )
    );
}

import React, { useRef, useState } from "react";
import { useSamarbeidsContext } from "./SamarbeidsContext";
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

export function Samarbeidsoversikt() {
    const buttonRef = useRef<SVGSVGElement>(null);
    const [openState, setOpenState] = useState(false);
    const { iaSak, iaProsesser, virksomhet, gjeldendeProsessId } =
        useSamarbeidsContext();

    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    const iaProsess = iaProsesser.find(
        (prosess) => prosess.id === gjeldendeProsessId,
    );

    return (
        iaProsess && (
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
                                level={"2"}
                                size={"xlarge"}
                                variant={"neutral"}
                                href={`/virksomhet/${virksomhet.orgnr}`}
                                title="Gå til virksomhet"
                            >
                                {virksomhet.navn}
                            </Heading>
                            <ChevronRightIcon fontSize="2rem" />
                            <Heading level={"3"} size={"large"} color={"blue"}>
                                {iaProsess.navn !== null
                                    ? iaProsess.navn
                                    : "Samarbeid uten navn"}
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

import React, { useRef, useState } from "react";
import styled from "styled-components";

import { Heading, HStack, Popover, VStack } from "@navikt/ds-react";
import { InformationSquareIcon } from "@navikt/aksel-icons";

import { VirksomhetsInfoPopoverInnhold } from "./VirksomhetsInfoPopoverInnhold";
import { useHentSalesforceUrl } from "../../../../api/lydia-api";
import { EksternLenke } from "../../../../components/EksternLenke";
import EierOgStatus from "./EierOgStatus";
import VirksomhetContext, {
    VirksomhetContextType,
} from "../../VirksomhetContext";

import { SamarbeidsDropdown } from "../../Samarbeid/SamarbeidsDropdown";

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

export default function NyVirksomhetsoversikt() {
    const { virksomhet, iaSak } = React.useContext(
        VirksomhetContext,
    ) as VirksomhetContextType;
    const buttonRef = useRef<SVGSVGElement>(null);
    const [openState, setOpenState] = useState(false);
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    return (
        <Container>
            <VStack gap={"10"}>
                <HStack justify="space-between" align="start">
                    <HStack gap={"4"}>
                        <SamarbeidsDropdown
                            iaSak={iaSak}
                            virksomhet={virksomhet}
                        />
                        <EierOgStatus />
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
                    <Heading level={"2"} size={"xlarge"}>
                        {virksomhet.navn}
                    </Heading>
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

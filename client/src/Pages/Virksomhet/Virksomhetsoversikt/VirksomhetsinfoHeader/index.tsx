import React, { useRef, useState } from "react";
import styled from "styled-components";

import { Heading, HStack, Popover, VStack } from "@navikt/ds-react";
import { InformationSquareIcon } from "@navikt/aksel-icons";

import { VirksomhetsInfoPopoverInnhold } from "./VirksomhetsInfoPopoverInnhold";
import { useHentSalesforceUrl } from "../../../../api/lydia-api";
import { EksternLenke } from "../../../../components/EksternLenke";
import Navigasjonsknapper from "./Navigasjonsknapper";
import EierOgStatus from "./EierOgStatus";
import VirksomhetContext, {
    VirksomhetContextType,
} from "../../VirksomhetContext";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    gap: 0.75rem;
    border-bottom: 1px solid var(--a-gray-300);
`;

const SalesforceLenke = styled(EksternLenke)`
    font-size: 1.125rem;
`;

const NavnOgIkonContainer = styled.div`
    display: flex;
    flex-direction: row;
`;
const VirksomhetsInfoIkon = styled(InformationSquareIcon)`
    display: flex;
    margin-top: 0.25rem;
    margin-left: 1rem;
    cursor: pointer;
`;

const TittelseksjonMedLavFontWeight = styled.span`
    font-weight: 400;
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
            <VStack>
                <HStack justify="space-between" align="start">
                    <VStack>
                        {salesforceInfo && (
                            <SalesforceLenke href={salesforceInfo?.url}>
                                Salesforce
                            </SalesforceLenke>
                        )}
                        <NavnOgIkonContainer>
                            <Heading level={"2"} size={"large"}>
                                {virksomhet.navn}
                                <TittelseksjonMedLavFontWeight>
                                    {" "}
                                    - {virksomhet.orgnr}
                                </TittelseksjonMedLavFontWeight>
                            </Heading>
                            <VirksomhetsInfoIkon
                                title={"Se detaljer"}
                                ref={buttonRef}
                                onClick={() => setOpenState(!openState)}
                                fontSize="2rem"
                            />
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
                        </NavnOgIkonContainer>
                    </VStack>
                    <EierOgStatus />
                </HStack>
                <Navigasjonsknapper />
            </VStack>
        </Container>
    );
}

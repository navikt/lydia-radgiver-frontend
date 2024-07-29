import { useRef, useState } from "react";
import styled from "styled-components";

import { Heading, Popover } from "@navikt/ds-react";
import { InformationSquareIcon } from "@navikt/aksel-icons";

import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { VirksomhetsInfoPopoverInnhold } from "./VirksomhetsInfoPopoverInnhold";
import { useHentSalesforceUrl } from "../../../../api/lydia-api";
import { EksternLenke } from "../../../../components/EksternLenke";
import { IASak } from "../../../../domenetyper/domenetyper";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    gap: 0.75rem;
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

interface Props {
    virksomhet: Virksomhet;
    iaSak?: IASak;
}

export default function VirksomhetsinfoHeader({ virksomhet, iaSak }: Props) {
    const buttonRef = useRef<SVGSVGElement>(null);
    const [openState, setOpenState] = useState(false);
    const { data: salesforceInfo } = useHentSalesforceUrl(virksomhet.orgnr);

    return (
        <Container>
            {salesforceInfo && (
                <SalesforceLenke href={salesforceInfo?.url}>
                    Salesforce
                </SalesforceLenke>
            )}
            <NavnOgIkonContainer>
                <Heading level={"2"} size={"large"}>
                    {virksomhet.navn}<TittelseksjonMedLavFontWeight> - {virksomhet.orgnr}</TittelseksjonMedLavFontWeight>
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
        </Container>
    );
}

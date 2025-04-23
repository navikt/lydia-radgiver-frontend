import { EksternLenke } from "../EksternLenke";
import styled from "styled-components";
import { Button, Popover } from "@navikt/ds-react";
import { useHentPubliseringsinfo } from "../../api/lydia-api/virksomhet";
import { getGjeldendePeriodeTekst } from "../../util/gjeldendePeriodeSisteFireKvartal";
import {
    EksternNavigeringKategorier,
    loggNavigeringMedEksternLenke,
} from "../../util/amplitude-klient";
import React from "react";
import { QuestionmarkCircleIcon } from "@navikt/aksel-icons";

export const Footer = () => {
    return (
        <StyledNyFooter>
            <NyFooterSykefraværsstatistikk />
            <EksternLenke
                href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/FIA-brukerveiledning.aspx"
                underline={false}
                onClick={() =>
                    loggNavigeringMedEksternLenke(
                        EksternNavigeringKategorier.FIA_BRUKERVEILEDNING,
                    )
                }
            >
                Brukerveiledning for Fia
            </EksternLenke>
            <EksternLenke
                href="https://jira.adeo.no/plugins/servlet/desk/portal/541/create/4362"
                underline={false}
                onClick={() =>
                    loggNavigeringMedEksternLenke(
                        EksternNavigeringKategorier.PORTEN,
                    )
                }
            >
                Send melding i Porten
            </EksternLenke>
        </StyledNyFooter>
    );
};

const StyledNyFooter = styled.footer`
    background-color: var(--a-blue-100);
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem 4rem;
`;

const StyledPopover = styled(Popover)`
    --ac-popover-bg: var(--a-surface-inverted);
    color: var(--a-text-on-inverted);
`;

const PopoverContentMedMaxWidth = styled(Popover.Content)`
    max-width: 30rem;
`;

const Sykefraværsstatistikkknapp = styled(Button)`
    --a-font-weight-bold: 400;
    --ac-button-tertiary-hover-bg: var(--a-surface-action-active);
    --ac-button-tertiary-hover-text: var(--a-surface-default);
    padding: 0.25rem;
`;

function NyFooterSykefraværsstatistikk() {
    const { data: publiseringsinfo } = useHentPubliseringsinfo();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Sykefraværsstatistikkknapp
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                icon={<QuestionmarkCircleIcon />}
                variant="tertiary"
            >
                Sykefraværsstatistikken
            </Sykefraværsstatistikkknapp>
            <StyledPopover
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={buttonRef.current}
            >
                <PopoverContentMedMaxWidth>
                    Fia viser offisiell sykefraværsstatistikk fra de siste
                    fire kvartalene {getGjeldendePeriodeTekst(publiseringsinfo)}.
                    Neste publiseringsdato er {publiseringsinfo?.nestePubliseringsdato}.
                    Tall for &quot;arbeidsforhold&quot; er fra siste tilgjengelige kvartal.
                    Se mer informasjon i brukerveiledningen.
                </PopoverContentMedMaxWidth>
            </StyledPopover>
        </>
    );
}
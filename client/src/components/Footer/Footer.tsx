import { EksternLenke } from "../EksternLenke";
import { Button, Popover } from "@navikt/ds-react";
import { useHentPubliseringsinfo } from "../../api/lydia-api/virksomhet";
import { getGjeldendePeriodeTekst } from "../../util/gjeldendePeriodeSisteFireKvartal";
import {
    EksternNavigeringKategorier,
    loggNavigeringMedEksternLenke,
} from "../../util/analytics-klient";
import React from "react";
import { QuestionmarkCircleIcon } from "@navikt/aksel-icons";
import styles from "./footer.module.scss";

export const Footer = () => {
    return (
        <footer className={styles.styledFooter}>
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
        </footer>
    );
};

function NyFooterSykefraværsstatistikk() {
    const { data: publiseringsinfo } = useHentPubliseringsinfo();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button
                ref={buttonRef}
                className={styles.sykefraværsstatistikkknapp}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                icon={<QuestionmarkCircleIcon />}
                variant="tertiary"
                size="xsmall"
            >
                Sykefraværsstatistikken
            </Button>
            <Popover
                open={open}
                className={styles.styledPopover}
                onClose={() => setOpen(false)}
                anchorEl={buttonRef.current}
            >
                <Popover.Content className={styles.popoverContentMedMaxWidth}>
                    Fia viser offisiell sykefraværsstatistikk fra de siste fire
                    kvartalene {getGjeldendePeriodeTekst(publiseringsinfo)}.
                    Neste publiseringsdato er{" "}
                    {publiseringsinfo?.nestePubliseringsdato}. Tall for
                    &quot;arbeidsforhold&quot; er fra siste tilgjengelige
                    kvartal. Se mer informasjon i brukerveiledningen.
                </Popover.Content>
            </Popover>
        </>
    );
}

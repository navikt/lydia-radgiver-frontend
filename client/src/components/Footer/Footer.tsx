import { EksternLenke } from "../EksternLenke";
import styled from "styled-components";
import { NavFarger } from "../../styling/farger";
import { contentSpacing } from "../../styling/contentSpacing";
import { desktopAndUp, largeDesktopAndUp } from "../../styling/breakpoints";
import { BodyShort } from "@navikt/ds-react";
import { useHentPubliseringsinfo } from "../../api/lydia-api/virksomhet";
import { getGjeldendePeriodeTekst } from "../../util/gjeldendePeriodeSisteFireKvartal";
import {
    EksternNavigeringKategorier,
    loggNavigeringMedEksternLenke,
} from "../../util/amplitude-klient";

const StyledFooter = styled.footer`
    background-color: ${NavFarger.deepblue800};
    color: ${NavFarger.textInverted};

    a {
        color: ${NavFarger.textInverted};
    }

    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 1rem;

    padding: 1.5rem ${contentSpacing.mobileX};

    ${desktopAndUp} {
        padding-left: ${contentSpacing.desktopX};
        padding-right: ${contentSpacing.desktopX};
    }

    ${largeDesktopAndUp} {
        padding-left: ${contentSpacing.largeDesktopX};
        padding-right: ${contentSpacing.largeDesktopX};
    }
`;

export const Footer = () => {
    const { data: publiseringsinfo } = useHentPubliseringsinfo();

    return (
        <StyledFooter>
            <BodyShort>
                {`Fia viser offisiell sykefraværsstatistikk fra de siste
                    fire kvartalene${getGjeldendePeriodeTekst(publiseringsinfo)}.
                    Neste publiseringsdato er ${publiseringsinfo?.nestePubliseringsdato}.
                    Tall for "arbeidsforhold" er fra siste tilgjengelige kvartal.
                    Du finner flere detaljer om statistikk i `}
                <EksternLenke
                    href={
                        "https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-inkluderende-arbeidsliv/SitePages/FIA-brukerveiledning.aspx"
                    }
                    onClick={() =>
                        loggNavigeringMedEksternLenke(
                            EksternNavigeringKategorier.FIA_BRUKERVEILEDNING,
                        )
                    }
                >
                    Brukerveiledning for Fia på Navet
                </EksternLenke>
            </BodyShort>
        </StyledFooter>
    );
};

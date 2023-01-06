import { EksternLenke } from "../EksternLenke";
import styled from "styled-components";
import { NavFarger } from "../../styling/farger";
import { contentSpacing } from "../../styling/contentSpacing";
import { desktopAndUp, largeDesktopAndUp } from "../../styling/breakpoint";
import { BodyShort } from "@navikt/ds-react";

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
    return (
        <StyledFooter>
            <BodyShort>
                Fia viser offisiell sykefraværsstatistikk fra de siste
                fire kvartalene (4. kvartal
                2021 - 3. kvartal 2022).
                Tall for &quot;arbeidsforhold&quot; er fra siste tilgjengelige kvartal.
                Du finner flere detaljer om statistikk i bruksanvisningen.
            </BodyShort>
            <EksternLenke
                href={"https://navno.sharepoint.com/sites/intranett-produktomrader-og-prosjekter/SitePages/FIA-brukerveiledning.aspx"}>
                Brukerveiledning for Fia på Navet
            </EksternLenke>
        </StyledFooter>
    )
}

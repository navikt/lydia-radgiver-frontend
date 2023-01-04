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

const StyledEksternLenke = styled(EksternLenke)`
  padding-left: 0.2rem;
`;

export const Footer = () => {
    return (
        <StyledFooter>
            <BodyShort>
                Fia viser offisiell sykefraværsstatistikk for virksomheter basert på tilgjengelige tall fra de siste
                fire kvartalene (4. kvartal
                2021 - 3. kvartal 2022).
                Tall for &quot;arbeidsforhold&quot; er hentet fra siste tilgjengelige kvartal for virksomheten.
            </BodyShort>
            <BodyShort>
                Du kan lese mer om dette i
                <StyledEksternLenke
                    href={"https://navno.sharepoint.com/sites/intranett-produktomrader-og-prosjekter/SitePages/FIA-brukerveiledning.aspx"}>
                    bruksanvisningen til Fia på Sharepoint
                </StyledEksternLenke>
            </BodyShort>
        </StyledFooter>
    )
}

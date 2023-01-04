import { EksternLenke } from "../EksternLenke";
import styled from "styled-components";
import { NavFarger } from "../../styling/farger";
import { contentSpacing } from "../../styling/contentSpacing";
import { desktopAndUp, largeDesktopAndUp } from "../../styling/breakpoint";


const StyledFooter = styled.footer`
  background-color: ${NavFarger.deepblue800};
  color: ${NavFarger.textInverted};
  
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;

  // Gjer at bakgrunnsgfargen dekkjer heile breidda/høgda av skjermen
  margin-left: -${contentSpacing.mobileX};
  margin-right: -${contentSpacing.mobileX};
  padding-left: ${contentSpacing.mobileX};
  padding-right: ${contentSpacing.mobileX};

  ${desktopAndUp} {
    margin-left: -${contentSpacing.desktopX};
    margin-right: -${contentSpacing.desktopX};
    padding-left: ${contentSpacing.desktopX};
    padding-right: ${contentSpacing.desktopX};
  }

  ${largeDesktopAndUp} {
    margin-left: -${contentSpacing.largeDesktopX};
    margin-right: -${contentSpacing.largeDesktopX};
    padding-left: ${contentSpacing.largeDesktopX};
    padding-right: ${contentSpacing.largeDesktopX};
  }
`;

export const Footer = () => {
    return (
        <StyledFooter>
            <EksternLenke href={"https://navno.sharepoint.com/sites/intranett-produktomrader-og-prosjekter/SitePages/FIA-brukerveiledning.aspx"}>Bruksanvisning for Fia på Sharepoint</EksternLenke>
        </StyledFooter>
    )
}
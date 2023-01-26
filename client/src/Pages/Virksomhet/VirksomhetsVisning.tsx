import styled from "styled-components";
import { IASak, Sakshistorikk, Virksomhet, } from "../../domenetyper";
import { Samarbeidshistorikk } from "./Samarbeidshistorikk/Samarbeidshistorikk";
import { Virksomhetsoversikt } from "./Virksomhetsoversikt/Virksomhetsoversikt";
import { contentSpacing } from "../../styling/contentSpacing";
import { Tabs } from "@navikt/ds-react";
import { NavFarger } from "../../styling/farger";
import { desktopAndUp, largeDesktopAndUp } from "../../styling/breakpoint";

const Container = styled.div`
  padding-top: ${contentSpacing.mobileY};
  height: 100%;

  background-color: ${NavFarger.white};
  
  // Gjer at bakgrunnsgfargen dekkjer heile breidda av skjermen
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

const StyledPanel = styled(Tabs.Panel)`
  padding-top: 1.5rem;
  height: 100%;

  background-color: ${NavFarger.gray100};
  
  // Gjer at bakgrunnsgfargen dekkjer heile breidda av skjermen
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

interface Props {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    samarbeidshistorikk: Sakshistorikk[];
    muterState?: () => void;
}

export const VirksomhetsVisning = ({ virksomhet, iaSak, samarbeidshistorikk, muterState }: Props) => {
    return (
        <Container>
            <Virksomhetsoversikt virksomhet={virksomhet} iaSak={iaSak} muterState={muterState} />
            <br />
            <Tabs defaultValue="samarbeidshistorikk" style={{height: "100%"}}>
                <Tabs.List style={{width: "100%"}}>
                    <Tabs.Tab value="samarbeidshistorikk" label="Samarbeidshistorikk" />
                </Tabs.List>
                <StyledPanel value="samarbeidshistorikk">
                    <Samarbeidshistorikk samarbeidshistorikk={samarbeidshistorikk} />
                </StyledPanel>
            </Tabs>
        </Container>
    );
};

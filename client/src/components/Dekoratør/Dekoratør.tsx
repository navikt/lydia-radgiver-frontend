import styled from "styled-components";
import { BodyShort, InternalHeader, Link } from "@navikt/ds-react";
import { Søkefelt } from "./Søkefelt";
import { NavFarger } from "../../styling/farger";
import { Brukerinformasjon as BrukerinformasjonType } from "../../domenetyper/brukerinformasjon";
import { SesjonBanner } from "../Banner/SesjonBanner";
import { NyStatistikkPubliseresBanner } from "../Banner/NyStatistikkPubliseresBanner";
import { mobileAndUp, tabletAndUp } from "../../styling/breakpoints";

const StyledInternalHeader = styled(InternalHeader)`
  min-height: unset; // Motvirkar "min-height: 3rem" frå designsystemet som gjer at boksen ikkje får bakgrunn på alt når den wrapper

  flex-wrap: wrap;
  flex-direction: column;

  ${mobileAndUp} { // Alt utanom pittesmå skjermar
    flex-direction: row;
  }
`;

const Navigasjon = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: start;

  ${tabletAndUp} {
    flex-direction: row;
    align-items: center;
  }
`;

const DemoversjonTekst = styled(BodyShort)<{ hidden: boolean }>`
  display: ${(props) => props.hidden ? "none" : "flex"};
  justify-content: center;
  align-items: center;

  padding: 0 1.5rem;

  color: ${NavFarger.white};
  background: ${NavFarger.red500};
`;

const Navigasjonslenke = styled(Link)`
  color: ${NavFarger.textInverted};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SøkOgBrukerinfoContainer = styled.div`
  flex: 1;

  display: flex;
`;

const Virksomhetssøk = styled(Søkefelt)`
  min-width: 16rem;
  width: 25%;

  align-self: center;

  /* Sentrerer søkeboks i det ledig området */
  margin-left: auto;
  margin-right: auto;
`;

const Brukerinformasjon = styled(InternalHeader.User)`
  color: ${NavFarger.white}
`;

export const erIDev = ["localhost", "fia.intern.dev.nav.no"].includes(window.location.hostname)

interface Props {
    brukerInformasjon: BrukerinformasjonType;
}

export const Dekoratør = ({ brukerInformasjon }: Props) => {
    return (
        <>
            <StyledInternalHeader className="w-full" data-theme="light">
                <Navigasjon>
                    <Navigasjonslenke href="/" title="Gå til søkesiden">
                        <InternalHeader.Title as="h1">Fia</InternalHeader.Title>
                    </Navigasjonslenke>
                    <Navigasjonslenke href="/statusoversikt" title="Gå til statusoversiktsiden">
                        <InternalHeader.Title as="span">Statusoversikt</InternalHeader.Title>
                    </Navigasjonslenke>
                    <Navigasjonslenke href="/iatjenesteoversikt" title="Gå til mine IA-tjenester">
                        <InternalHeader.Title as="span">Mine IA-tjenester</InternalHeader.Title>
                    </Navigasjonslenke>
                </Navigasjon>
                <DemoversjonTekst hidden={!erIDev}>Demoutgave</DemoversjonTekst>
                <SøkOgBrukerinfoContainer>
                    <Virksomhetssøk />
                    <Brukerinformasjon name={brukerInformasjon.navn} description={brukerInformasjon.ident} />
                </SøkOgBrukerinfoContainer>
            </StyledInternalHeader>
            <SesjonBanner tokenUtløper={brukerInformasjon.tokenUtløper} />
            <NyStatistikkPubliseresBanner />
        </>
    )
}

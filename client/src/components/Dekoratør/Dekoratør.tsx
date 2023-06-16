import styled from "styled-components";
import { BodyShort, Link, InternalHeader } from "@navikt/ds-react";
import { Søkefelt } from "./Søkefelt";
import { NavFarger } from "../../styling/farger";
import { Brukerinformasjon as BrukerinformasjonType } from "../../domenetyper/brukerinformasjon";
import { SesjonBanner } from "../Banner/SesjonBanner";
import { NyStatistikkPubliseresBanner } from "../Banner/NyStatistikkPubliseresBanner";

const DemoversjonTekst = styled(BodyShort)<{hidden: boolean}>`
  display: ${(props) => props.hidden ? "none" : "flex"};
  align-items: center;
  padding: 0 1.5rem;
  color: ${NavFarger.white};
  background: ${NavFarger.red500};
`;

const Navigasjon = styled.nav`
  align-self: center;
  margin-right: auto; // dyttar søkefeltet inn til midten
`;

const LenkeTilSøkesiden = styled(Link)`
  color: ${NavFarger.textInverted};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LenkeTilStatusoversikt = styled(Link)`
  color: ${NavFarger.textInverted};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Brukerinformasjon = styled(InternalHeader.User)`
  margin-left: auto; // dyttar søkefeltet inn til midten
  color: ${NavFarger.white}
`;

interface Props {
    brukerInformasjon: BrukerinformasjonType;
}

export const erIDev = ["localhost", "fia.intern.dev.nav.no"].includes(window.location.hostname)

export const Dekoratør = ({brukerInformasjon}: Props) => {
    return (
        <>
            <InternalHeader className="w-full" data-theme="light">
                <Navigasjon>
                    <LenkeTilSøkesiden href="/" title="Gå til søkesiden">
                        <InternalHeader.Title as="h1">Fia</InternalHeader.Title>
                    </LenkeTilSøkesiden>
                    <LenkeTilStatusoversikt href="/statusoversikt" title="Gå til statusoversiktsiden">
                        <InternalHeader.Title>Statusoversikt</InternalHeader.Title>
                    </LenkeTilStatusoversikt>
                </Navigasjon>
                <DemoversjonTekst hidden={!erIDev}>Demoutgave</DemoversjonTekst>
                <Søkefelt style={{
                    minWidth: "16rem",
                    width: "25%",
                }} />
                {brukerInformasjon && (
                    <Brukerinformasjon
                        name={brukerInformasjon.navn}
                        description={brukerInformasjon.ident}
                    />
                )}
            </InternalHeader>
            <SesjonBanner tokenUtløper={brukerInformasjon.tokenUtløper} />
            <NyStatistikkPubliseresBanner />
        </>
    )
}

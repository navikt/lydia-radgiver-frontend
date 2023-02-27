import styled from "styled-components";
import { BodyShort, Link } from "@navikt/ds-react";
import { Header } from "@navikt/ds-react-internal";
import { Søkefelt } from "./Søkefelt";
import { NavFarger } from "../../styling/farger";
import { Brukerinformasjon } from "../../domenetyper/brukerinformasjon";
import { NyStatistikkPubliseresBanner } from "../Banner/NyStatistikkPubliseresBanner";
import { SesjonBanner } from "../Banner/SesjonBanner";

const DemoversjonTekst = styled(BodyShort)<{ hidden: boolean }>`
  display: ${(props) => props.hidden ? "none" : "flex"};
  align-items: center;
  padding: 0 1.5rem;
  color: ${NavFarger.white};
  background: ${NavFarger.red500};
`;

const LenkeTilSøkesiden = styled(Link)`
  margin-right: auto;
  color: ${NavFarger.textInverted};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface Props {
    brukerInformasjon: Brukerinformasjon;
}

export const erIDev = ["localhost", "fia.dev.intern.nav.no"].includes(window.location.hostname)

export const Dekoratør = ({ brukerInformasjon }: Props) => {
    return (
        <>
            <Header className="w-full" data-theme="light">
                <LenkeTilSøkesiden href="/" title="Gå til søkesiden">
                    <Header.Title as="h1">Fia</Header.Title>
                </LenkeTilSøkesiden>
                <DemoversjonTekst hidden={!erIDev}>Demoutgave</DemoversjonTekst>
                <Søkefelt style={{
                    minWidth: "16rem",
                    width: "25%",
                }} />
                {brukerInformasjon && (
                    <Header.User
                        name={brukerInformasjon.navn}
                        description={brukerInformasjon.ident}
                        style={{ marginLeft: "auto", color: NavFarger.white }}
                    />
                )}
            </Header>
            <SesjonBanner brukerInformasjon={brukerInformasjon} />
            <NyStatistikkPubliseresBanner />
        </>
    )
}

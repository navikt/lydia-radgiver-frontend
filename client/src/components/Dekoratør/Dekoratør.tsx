import { useEffect, useState } from "react";
import styled from "styled-components";
import { BodyShort, Link } from "@navikt/ds-react";
import { Header } from "@navikt/ds-react-internal";
import { Søkefelt } from "./Søkefelt";
import { NavFarger } from "../../styling/farger";
import { Brukerinformasjon } from "../../domenetyper/brukerinformasjon";
import { NyStatistikkPubliseresBanner } from "../Banner/NyStatistikkPubliseresBanner";
import { Banner } from "../Banner/Banner";

const FEM_MINUTTER_SOM_MS = 1000 * 60 * 5

const hentRedirectUrl = () =>
    `${document.location.origin}/oauth2/login?redirect=${document.location.href}`

const hentGjenværendeTidForBrukerMs = (brukerInformasjon: Brukerinformasjon) =>
    brukerInformasjon.tokenUtløper - Date.now()

const tokenHolderPåÅLøpeUt = (brukerInformasjon: Brukerinformasjon) =>
    hentGjenværendeTidForBrukerMs(brukerInformasjon) < FEM_MINUTTER_SOM_MS

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
    brukerInformasjon: Brukerinformasjon
}

export const erIDev = ["localhost", "fia.dev.intern.nav.no"].includes(window.location.hostname)

export const Dekoratør = ({ brukerInformasjon }: Props) => {
    const [gjenværendeTidForBrukerMs, setGjenværendeTidForBrukerMs] = useState(
        hentGjenværendeTidForBrukerMs(brukerInformasjon)
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setGjenværendeTidForBrukerMs(hentGjenværendeTidForBrukerMs(brukerInformasjon))
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
            {tokenHolderPåÅLøpeUt(brukerInformasjon) &&
                <RedirectKomponent gjenværendeTidForBrukerMs={gjenværendeTidForBrukerMs} />
            }
            <NyStatistikkPubliseresBanner />
        </>
    )
}

const RedirectKomponent = ({ gjenværendeTidForBrukerMs }: { gjenværendeTidForBrukerMs: number }) => {
    return gjenværendeTidForBrukerMs > 0
        ? <SesjonenHolderPåÅLøpeUt gjenværendeTidForBrukerMs={gjenværendeTidForBrukerMs} />
        : <SesjonenErUtløpt />
}

const SesjonenHolderPåÅLøpeUt = ({ gjenværendeTidForBrukerMs }: { gjenværendeTidForBrukerMs: number }) => {
    const gjenværendeSekunder = Math.round(gjenværendeTidForBrukerMs / 1000)
    return (
        <Banner variant="warning">
            <BodyShort>
                Sesjonen din løper ut om {gjenværendeSekunder} sekunder. Vennligst trykk på <Link
                href={hentRedirectUrl()}>denne lenken</Link> for å logge inn på nytt
            </BodyShort>
        </Banner>
    )
}

const SesjonenErUtløpt = () =>
    <Banner variant="error">
        <BodyShort>
            Sesjonen din er utløpt. Vennligst trykk på <Link href={hentRedirectUrl()}>denne lenken</Link> for å logge
            inn på nytt
        </BodyShort>
    </Banner>

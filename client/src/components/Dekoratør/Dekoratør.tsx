import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Alert, BodyShort, Link } from "@navikt/ds-react";
import { Header } from "@navikt/ds-react-internal";
import { Brukerinformasjon } from "../../domenetyper";
import { TittelContext } from "../../Pages/Prioritering/TittelContext";
import { Søkefelt } from "./Søkefelt";
import { NavFarger } from "../../styling/farger";

const FEM_MINUTTER_SOM_MS = 1000 * 60 * 5

const hentRedirectUrl = () =>
    `${document.location.origin}/oauth2/login?redirect=${document.location.href}`

const hentGjenværendeTidForBrukerMs = (brukerInformasjon: Brukerinformasjon) =>
    brukerInformasjon.tokenUtløper - Date.now()

const tokenHolderPåÅLøpeUt = (brukerInformasjon: Brukerinformasjon) =>
    hentGjenværendeTidForBrukerMs(brukerInformasjon) < FEM_MINUTTER_SOM_MS

const DemoversjonTekst = styled(BodyShort)<{ erIProd: boolean }>`
  display: ${(props) => props.erIProd ? "none" : "flex"};
  align-items: center;
  padding: 0 1.5rem;
  background: ${NavFarger.red500};
`;

interface Props {
    brukerInformasjon: Brukerinformasjon
}

export const Dekoratør = ({brukerInformasjon}: Props) => {
    const {tittel} = useContext(TittelContext)
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
            <Header className="w-full">
                <Header.Title as="h1" style={{marginRight: "auto"}}>{tittel}</Header.Title>
                <DemoversjonTekst erIProd={true}>Demoutgave</DemoversjonTekst>
                <Søkefelt style={{
                    minWidth: "16rem",
                    width: "25%",
                }} />
                {brukerInformasjon && (
                    <Header.User
                        name={brukerInformasjon.navn}
                        description={brukerInformasjon.ident}
                        style={{marginLeft: "auto"}}
                    />
                )}
            </Header>
            {tokenHolderPåÅLøpeUt(brukerInformasjon) &&
                <RedirectKomponent gjenværendeTidForBrukerMs={gjenværendeTidForBrukerMs} />}
        </>
    )
}

const RedirectKomponent = ({gjenværendeTidForBrukerMs}: { gjenværendeTidForBrukerMs: number }) => {
    return gjenværendeTidForBrukerMs > 0
        ? <SesjonenHolderPåÅLøpeUt gjenværendeTidForBrukerMs={gjenværendeTidForBrukerMs} />
        : <SesjonenErUtløpt />
}

const SesjonenHolderPåÅLøpeUt = ({gjenværendeTidForBrukerMs}: { gjenværendeTidForBrukerMs: number }) => {
    const gjenværendeSekunder = Math.round(gjenværendeTidForBrukerMs / 1000)
    return (
        <Alert variant="warning" style={{margin: "1rem"}}>
            <BodyShort>
                Sesjonen din løper ut om {gjenværendeSekunder} sekunder. Vennligst trykk på <Link
                href={hentRedirectUrl()}>denne lenken</Link> for å logge inn på nytt
            </BodyShort>
        </Alert>
    )
}

const SesjonenErUtløpt = () =>
    <Alert variant="error" style={{margin: "1rem"}}>
        <BodyShort>
            Sesjonen din er utløpt. Vennligst trykk på <Link href={hentRedirectUrl()}>denne lenken</Link> for å logge
            inn på nytt
        </BodyShort>
    </Alert>

import {Brukerinformasjon} from "../../domenetyper";
import {Alert, BodyShort, Link} from "@navikt/ds-react";
import {Header} from "@navikt/ds-react-internal";
import {useEffect, useState} from "react";

interface Props {
    brukerInformasjon: Brukerinformasjon
}

const FEM_MINUTTER_SOM_MS = 1000 * 60 * 5

const hentRedirectUrl = () =>
    `${document.location.origin}/oauth2/login?redirect=${document.location.href}`

const hentGjenværendeTidForBrukerMs = (brukerInformasjon: Brukerinformasjon) =>
    brukerInformasjon.tokenUtløper - Date.now()

const tokenHolderPåÅLøpeUt = (brukerInformasjon: Brukerinformasjon) =>
    hentGjenværendeTidForBrukerMs(brukerInformasjon) < FEM_MINUTTER_SOM_MS

export const Dekoratør = ({brukerInformasjon}: Props) => {
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
                <Header.Title as="h1">Fia</Header.Title>
                {brukerInformasjon && (
                    <Header.User
                        name={brukerInformasjon.navn}
                        description={brukerInformasjon.ident}
                        style={{marginLeft: "auto"}}
                    />
                )}
            </Header>
            {tokenHolderPåÅLøpeUt(brukerInformasjon) &&
                <RedirectKomponent gjenværendeTidForBrukerMs={gjenværendeTidForBrukerMs}/>}
        </>
    )
}

const RedirectKomponent = ({gjenværendeTidForBrukerMs}: { gjenværendeTidForBrukerMs: number }) => {
    return gjenværendeTidForBrukerMs > 0
        ? <SesjonenHolderPåÅLøpeUt gjenværendeTidForBrukerMs={gjenværendeTidForBrukerMs}/>
        : <SesjonenErUtløpt/>
}

const SesjonenHolderPåÅLøpeUt = ({gjenværendeTidForBrukerMs}: { gjenværendeTidForBrukerMs: number }) => {
    const gjenværendeSekunder = Math.round(gjenværendeTidForBrukerMs / 1000)
    return (
        <Alert variant="warning" style={{marginTop: "1rem"}}>
            <BodyShort>
                Sesjonen din løper ut om {gjenværendeSekunder} sekunder. Vennligst trykk på <Link
                href={hentRedirectUrl()}>denne lenken</Link> for å logge inn på nytt
            </BodyShort>
        </Alert>
    )
}

const SesjonenErUtløpt = () =>
    <Alert variant="error" style={{marginTop: "1rem"}}>
        <BodyShort>
            Sesjonen din er utløpt. Vennligst trykk på <Link href={hentRedirectUrl()}>denne lenken</Link> for å logge
            inn på nytt
        </BodyShort>
    </Alert>

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

const hentGjenværendeTidForBruker = (brukerInformasjon: Brukerinformasjon) =>
    brukerInformasjon.tokenUtløper - Date.now()

const tokenHolderPåÅLøpeUt = (brukerInformasjon: Brukerinformasjon) =>
    hentGjenværendeTidForBruker(brukerInformasjon) < FEM_MINUTTER_SOM_MS

export const Dekoratør = ({brukerInformasjon}: Props) => {
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
                <RedirectKomponent brukerInformasjon={brukerInformasjon}/>}
        </>
    )
}

const RedirectKomponent = ({brukerInformasjon}: Props) => {
    const [gjenværendeTidForBruker, setGjenværendeTidForBruker] = useState(
        hentGjenværendeTidForBruker(brukerInformasjon)
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setGjenværendeTidForBruker(hentGjenværendeTidForBruker(brukerInformasjon))
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const sekunderIgjen = Math.ceil(gjenværendeTidForBruker / 1000)

    return sekunderIgjen > 0
        ? <SesjonenHolderPåÅLøpeUt sekunderIgjen={sekunderIgjen}/>
        : <SesjonenErUtløpt/>
}

const SesjonenHolderPåÅLøpeUt = ({sekunderIgjen}: { sekunderIgjen: number }) =>
    <Alert variant="warning" style={{marginTop: "1rem"}}>
        <BodyShort>
            Sesjonen din løper ut om {sekunderIgjen} sekunder. Vennligst trykk på <Link href={hentRedirectUrl()}>denne
            lenken</Link> for å
            logge inn på nytt
        </BodyShort>
    </Alert>

const SesjonenErUtløpt = () =>
    <Alert variant="error" style={{marginTop: "1rem"}}>
        <BodyShort>
            Sesjonen din er utløpt. Vennligst trykk på <Link href={hentRedirectUrl()}>denne
            lenken</Link> for å
            logge inn på nytt
        </BodyShort>
    </Alert>

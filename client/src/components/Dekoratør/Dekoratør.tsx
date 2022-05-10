import {Brukerinformasjon} from "../../domenetyper";
import {Alert, BodyShort, Link} from "@navikt/ds-react";
import {Header} from "@navikt/ds-react-internal";

interface DekoratørProps {
    brukerInformasjon: Brukerinformasjon
}

export const Dekoratør = ({brukerInformasjon}: DekoratørProps) => {
    const tokenUtløperOmMs = Date.now() - brukerInformasjon.tokenUtløper
    const femMinutterSomMs = 1000 * 60 * 5
    const tokenHolderPåÅUtløpe = tokenUtløperOmMs > femMinutterSomMs

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
            {tokenHolderPåÅUtløpe && <RedirectKomponent/>}
        </>
    )
}

const RedirectKomponent = () => {
    const redirectURL = `${document.location.origin}/oauth2/login?redirect=${document.location.href}`
    return (
        <Alert variant="warning" style={{ marginTop : "1rem" }}>
            <BodyShort>
                Sesjonen din holder på å løpe ut. Vennligst trykk på <Link href={redirectURL}>denne lenken</Link> for å
                logge inn på nytt
            </BodyShort>
        </Alert>
    )
}

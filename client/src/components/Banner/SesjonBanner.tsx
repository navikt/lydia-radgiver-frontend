import { useEffect, useState } from "react";
import { BodyShort, Link } from "@navikt/ds-react";
import { Brukerinformasjon } from "../../domenetyper/brukerinformasjon";
import { Banner } from "./Banner";

const FEM_MINUTTER_SOM_MS = 1000 * 60 * 5;

const redirectUrl = `${document.location.origin}/oauth2/login?redirect=${document.location.href}`;

const hentGjenværendeTidForBrukerMs = (brukerInformasjon: Brukerinformasjon) =>
    brukerInformasjon.tokenUtløper - Date.now();

const tokenHolderPåÅLøpeUt = (brukerInformasjon: Brukerinformasjon) =>
    hentGjenværendeTidForBrukerMs(brukerInformasjon) < FEM_MINUTTER_SOM_MS;

interface Props {
    brukerInformasjon: Brukerinformasjon;
}

export const SesjonBanner = ({ brukerInformasjon }: Props) => {
    const [gjenværendeTidForBrukerMs, setGjenværendeTidForBrukerMs] = useState(
        hentGjenværendeTidForBrukerMs(brukerInformasjon)
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setGjenværendeTidForBrukerMs(hentGjenværendeTidForBrukerMs(brukerInformasjon))
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!tokenHolderPåÅLøpeUt(brukerInformasjon)) {
        return null;
    }

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
                href={redirectUrl}>denne lenken</Link> for å logge inn på nytt
            </BodyShort>
        </Banner>
    )
}

const SesjonenErUtløpt = () => {
    return <Banner variant="error">
        <BodyShort>
            Sesjonen din er utløpt. Vennligst trykk på <Link href={redirectUrl}>denne lenken</Link> for å logge
            inn på nytt
        </BodyShort>
    </Banner>;
}

import { useEffect, useState } from "react";
import { BodyShort, Link } from "@navikt/ds-react";
import { Banner } from "./Banner";

const FEM_MINUTTER_SOM_MS = 1000 * 60 * 5;

const redirectUrl = `${document.location.origin}/oauth2/login?redirect=${document.location.href}`;

interface Props {
    tokenUtløper: number;
}

export const SesjonBanner = ({ tokenUtløper }: Props) => {
    const [tidIgjenAvSesjon, setTidIgjenAvSesjon] = useState(tokenUtløper - Date.now());

    useEffect(() => {
        const interval = setInterval(
            () => setTidIgjenAvSesjon(tokenUtløper - Date.now()),
            1000,
        );
        return () => clearInterval(interval);
    }, [tokenUtløper]);


    if (tidIgjenAvSesjon >= FEM_MINUTTER_SOM_MS) {
        return null;
    }

    return tidIgjenAvSesjon > 0
        ? <SesjonenLøperUt tidIgjenAvSesjon={tidIgjenAvSesjon} />
        : <SesjonenErUtløpt />
}

interface SesjonenLøperUtProps {
    tidIgjenAvSesjon: number
}

const SesjonenLøperUt = ({ tidIgjenAvSesjon }: SesjonenLøperUtProps) => {
    const gjenværendeSekunder = Math.round(tidIgjenAvSesjon / 1000)

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

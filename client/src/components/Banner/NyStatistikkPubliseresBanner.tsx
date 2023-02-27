import { BodyShort, Heading } from "@navikt/ds-react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";

export const NyStatistikkPubliseresBanner = () => {
    const statistikkErPublisert = false;

    return (
        <>
            {statistikkErPublisert
                ? <NyStatistikkErUte />
                : <NyStatistikkKommerSnart />
            }
        </>
    )
}

const NyStatistikkKommerSnart = () => {
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">Snart kommer sykefraværsstatistikk for 4. kvartal 2022</Heading>
            <BodyShort>Fia blir oppdatert med nye tall i løpet av torsdag 2. mars.</BodyShort>
        </BannerMedLukkeknapp>
    )
}

const NyStatistikkErUte = () => {
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">Sykefraværsstatistikken i Fia er oppdatert med tall fra 4. kvartal 2022</Heading>
            <BodyShort>
                Løsningen er oppdatert med offisiell sykefraværsstatistikk for de siste fire kvartalene
                (1. kvartal 2022 – 4. kvartal 2022)
            </BodyShort>
            <BodyShort>
                Tall for de siste fire kvartalene er nå basert på 1. kvartal 2022 til 4. kvartal
                2022
            </BodyShort>
        </BannerMedLukkeknapp>
    )
}

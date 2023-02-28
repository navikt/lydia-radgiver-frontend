import { BodyShort, Heading } from "@navikt/ds-react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";

const publiseringsdag = "torsdag 2. mars";
const nyttKvartal = "4. kvartal 2022";
const siste4fra = "1. kvartal 2022";
const siste4til = nyttKvartal;

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
            <Heading size="xsmall">Snart kommer sykefraværsstatistikk for {nyttKvartal}</Heading>
            <BodyShort>Fia blir oppdatert med nye tall i løpet av {publiseringsdag}.</BodyShort>
        </BannerMedLukkeknapp>
    )
}

const NyStatistikkErUte = () => {
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">Sykefraværsstatistikken i Fia er oppdatert med tall fra {nyttKvartal}</Heading>
            <BodyShort>
                Tall for de siste fire kvartalene er nå basert på {siste4fra} til {siste4til}.
            </BodyShort>
        </BannerMedLukkeknapp>
    )
}

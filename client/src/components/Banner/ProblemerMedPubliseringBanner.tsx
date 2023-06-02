import { BodyShort, Heading } from "@navikt/ds-react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";

export const ProblemerMedPubliseringBanner = () => {
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">
                Tekniske problemer med oppdatering av sykefraværs&shy;statistikk for 1. kvartal 2023
            </Heading>
            <BodyShort>
                Vi jobber med å løse problemet og kommer tilbake med mer informasjon når vi har løst det.
            </BodyShort>
        </BannerMedLukkeknapp>
    )
}

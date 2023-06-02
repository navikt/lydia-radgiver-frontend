import styled from "styled-components";
import { BodyShort, Heading } from "@navikt/ds-react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";

const StyledBodyShort = styled(BodyShort)`
  width: 70em;
`;

export const ProblemerMedPubliseringBanner = () => {
    return (
        <BannerMedLukkeknapp variant="info">
            <Heading size="xsmall">
                Tekniske problemer med oppdatering av sykefraværsstatistikk for 1. kvartal 2023
            </Heading>
            <StyledBodyShort>
                Vi jobber med å løse problemet og kommer tilbake med mer informasjon når problemet er løst.
            </StyledBodyShort>
        </BannerMedLukkeknapp>
    )
}

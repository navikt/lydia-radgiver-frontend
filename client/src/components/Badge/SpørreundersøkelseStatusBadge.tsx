import "@navikt/ds-css";
import {
    spørreundersøkelseStatusEnum,
    SpørreundersøkelseStatus,
} from "../../domenetyper/domenetyper";
import { StyledStatusTag } from "./StatusBadge";

export const hentVariantForSpørreundersøkelseStatus = (
    status: SpørreundersøkelseStatus,
) => {
    switch (status) {
        case spørreundersøkelseStatusEnum.enum.PÅBEGYNT:
            return "alt1-moderate";
        case spørreundersøkelseStatusEnum.enum.OPPRETTET:
            return "neutral-moderate";
        case spørreundersøkelseStatusEnum.enum.AVSLUTTET:
            return "success-moderate";
        case spørreundersøkelseStatusEnum.enum.SLETTET:
            return "error-moderate";
    }
};

export function penskrivSpørreundersøkelseStatus(
    status: SpørreundersøkelseStatus,
): string {
    switch (status) {
        case spørreundersøkelseStatusEnum.enum.OPPRETTET:
            return "Opprettet";
        case spørreundersøkelseStatusEnum.enum.PÅBEGYNT:
            return "Påbegynt";
        case spørreundersøkelseStatusEnum.enum.AVSLUTTET:
            return "Fullført";
        case spørreundersøkelseStatusEnum.enum.SLETTET:
            return "Slettet";
    }
}

interface Props {
    status: SpørreundersøkelseStatus;
    ariaLive?: "off" | "polite" | "assertive";
    ariaLabel?: string;
}

export const SpørreundersøkelseStatusBadge = ({
    status,
    ariaLive,
    ariaLabel,
}: Props) => (
    <StyledStatusTag variant={hentVariantForSpørreundersøkelseStatus(status)} aria-live={ariaLive} aria-label={ariaLabel}>
        {penskrivSpørreundersøkelseStatus(status)}
    </StyledStatusTag>
);

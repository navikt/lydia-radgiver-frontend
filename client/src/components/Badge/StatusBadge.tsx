import "@navikt/ds-css";
import {
    IAProsessStatusEnum,
    IAProsessStatusType,
} from "../../domenetyper/domenetyper";
import styled from "styled-components";
import { Tag } from "@navikt/ds-react";

export const hentVariantForIAStatus = (
    status: IAProsessStatusType,
) => {
    switch (status) {
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
        default:
            return "neutral-moderate";
        case IAProsessStatusEnum.enum.VURDERES:
            return "info-moderate";
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "alt3-moderate";
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return "warning-moderate";
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return "success-filled";
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return "alt1-moderate";
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "error-moderate";
    }
};

export function penskrivIAStatus(status: IAProsessStatusType) {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
            return "Opprettet";
        case IAProsessStatusEnum.enum.VURDERES:
            return "Vurderes";
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
            return "Ikke aktiv";
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "Kontaktes";
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "Ikke aktuell";
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return "Kartlegges";
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return "Vi bistår";
        case IAProsessStatusEnum.enum.FULLFØRT:
            return "Fullført";
    }
}

interface Props {
    status: IAProsessStatusType;
    ariaLive?: "off" | "polite" | "assertive";
    ariaLabel?: string;
}

export const StyledStatusTag = styled(Tag).attrs({ size: "small" })`
    min-width: 6em;
    width: fit-content;
    height: fit-content;
`;

const StatusBadgeWrapper = styled.div`
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }
`;

export const StatusBadge = ({ status, ariaLive, ariaLabel }: Props) => (
    <StatusBadgeWrapper>
        <StyledStatusTag variant={hentVariantForIAStatus(status)} aria-live={ariaLive} aria-label={ariaLabel}>
            {penskrivIAStatus(status)}
        </StyledStatusTag>
    </StatusBadgeWrapper>
)

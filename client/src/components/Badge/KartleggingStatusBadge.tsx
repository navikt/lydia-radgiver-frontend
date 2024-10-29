import "@navikt/ds-css";
import React from "react";
import { Badge } from "./Badge";
import {
    spørreundersøkelseStatusEnum,
    SpørreundersøkelseStatus,
} from "../../domenetyper/domenetyper";
import { FiaFarger } from "../../styling/farger";
import styled from "styled-components";

export const hentBakgrunnsFargeForKartleggingStatus = (
    status: SpørreundersøkelseStatus,
): FiaFarger => {
    switch (status) {
        case spørreundersøkelseStatusEnum.enum.PÅBEGYNT:
            return FiaFarger.lilla;
        case spørreundersøkelseStatusEnum.enum.OPPRETTET:
            return FiaFarger.lysGrå;
        case spørreundersøkelseStatusEnum.enum.AVSLUTTET:
            return FiaFarger.lysGrønn;
        case spørreundersøkelseStatusEnum.enum.SLETTET:
            return FiaFarger.rød;
    }
};

export function penskrivKartleggingStatus(
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

const StatusBadgeWrapper = styled.div`
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }
`;

export const BehovsvurderingStatusBadge = ({
    status,
    ariaLive,
    ariaLabel,
}: Props) => (
    <StatusBadgeWrapper>
        <Badge
            backgroundColor={hentBakgrunnsFargeForKartleggingStatus(status)}
            ariaLive={ariaLive}
            ariaLabel={ariaLabel}
            variant="neutral-moderate"
            size="small"
            minWidth="1em"
        >
            {penskrivKartleggingStatus(status)}
        </Badge>
    </StatusBadgeWrapper>
);

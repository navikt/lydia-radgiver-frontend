import "@navikt/ds-css";
import React from "react";
import { Badge } from "./Badge";
import {
    spørreundersøkelseStatusEnum,
    SpørreundersøkelseStatus,
} from "../../domenetyper/domenetyper";
import { FiaFarger } from "../../styling/farger";
import styled from "styled-components";

export const hentBakgrunnsFargeForSpørreundersøkelseStatus = (
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
            backgroundColor={hentBakgrunnsFargeForSpørreundersøkelseStatus(
                status,
            )}
            ariaLive={ariaLive}
            ariaLabel={ariaLabel}
            variant="neutral-moderate"
            size="small"
            minWidth="1em"
        >
            {penskrivSpørreundersøkelseStatus(status)}
        </Badge>
    </StatusBadgeWrapper>
);

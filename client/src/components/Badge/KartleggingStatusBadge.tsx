import "@navikt/ds-css";
import React from "react";
import { Badge } from "./Badge";
import {
    iaSakKartleggingStatusEnum,
    IASakKartleggingStatusType,
} from "../../domenetyper/domenetyper";
import { FiaFarger } from "../../styling/farger";
import styled from "styled-components";

export const hentBakgrunnsFargeForKartleggingStatus = (
    status: IASakKartleggingStatusType,
): FiaFarger => {
    switch (status) {
        case iaSakKartleggingStatusEnum.enum.PÅBEGYNT:
            return FiaFarger.lilla;
        case iaSakKartleggingStatusEnum.enum.OPPRETTET:
            return FiaFarger.lysGrå;
        case iaSakKartleggingStatusEnum.enum.AVSLUTTET:
            return FiaFarger.lysGrønn;
        case iaSakKartleggingStatusEnum.enum.SLETTET:
            return FiaFarger.rød;
    }
};

export function penskrivKartleggingStatus(
    status: IASakKartleggingStatusType,
): string {
    switch (status) {
        case iaSakKartleggingStatusEnum.enum.OPPRETTET:
            return "Opprettet";
        case iaSakKartleggingStatusEnum.enum.PÅBEGYNT:
            return "Påbegynt";
        case iaSakKartleggingStatusEnum.enum.AVSLUTTET:
            return "Fullført";
        case iaSakKartleggingStatusEnum.enum.SLETTET:
            return "Slettet";
    }
}

interface Props {
    status: IASakKartleggingStatusType;
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

export const KartleggingStatusBedge = ({
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

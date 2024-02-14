import "@navikt/ds-css";
import React from "react";
import { Badge } from "./Badge";
import {
    iaSakKartleggingStatusEnum,
    IASakKartleggingStatusType,
    IAProsessStatusEnum,
    IAProsessStatusType,
} from "../../domenetyper/domenetyper";
import { FiaFarger } from "../../styling/farger";
import styled from "styled-components";

export const hentBakgrunnsFargeForIAStatus = (
    status: IAProsessStatusType | IASakKartleggingStatusType,
): FiaFarger => {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return FiaFarger.hvit;
        case IAProsessStatusEnum.enum.VURDERES:
            return FiaFarger.lyseBlå;
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
            return FiaFarger.grå;
        case IAProsessStatusEnum.enum.KONTAKTES:
            return FiaFarger.mørkeBlå;
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return FiaFarger.rød;
        case iaSakKartleggingStatusEnum.enum.OPPRETTET:
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return FiaFarger.gul;
        case iaSakKartleggingStatusEnum.enum.AVSLUTTET:
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return FiaFarger.grønn;
    }
};

export function penskrivIAStatus(
    status: IAProsessStatusType | IASakKartleggingStatusType,
): string {
    switch (status) {
        case iaSakKartleggingStatusEnum.enum.OPPRETTET:
            return "Ikke besøkt";
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
        case iaSakKartleggingStatusEnum.enum.AVSLUTTET:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return "Fullført";
    }
}

interface Props {
    status: IAProsessStatusType | IASakKartleggingStatusType;
    ariaLive?: "off" | "polite" | "assertive";
    ariaLabel?: string;
}

const StatusBadgeWrapper = styled.div`
    :focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

export const StatusBadge = ({ status, ariaLive, ariaLabel }: Props) => (
    <StatusBadgeWrapper>
        <Badge
            backgroundColor={hentBakgrunnsFargeForIAStatus(status)}
            ariaLive={ariaLive}
            ariaLabel={ariaLabel}
        >
            {penskrivIAStatus(status)}
        </Badge>
    </StatusBadgeWrapper>
);

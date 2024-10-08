import "@navikt/ds-css";
import React from "react";
import { Badge } from "./Badge";
import {
    IAProsessStatusEnum,
    IAProsessStatusType,
} from "../../domenetyper/domenetyper";
import { FiaFarger } from "../../styling/farger";
import styled from "styled-components";
import { Tag, TagProps } from "@navikt/ds-react";

export const hentBakgrunnsFargeForIAStatus = (
    status: IAProsessStatusType,
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
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return FiaFarger.gul;
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return FiaFarger.grønn;
    }
};

export function penskrivIAStatus(status: IAProsessStatusType): string {
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

const StatusBadgeWrapper = styled.div`
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }
`;

export const hentBakgrunnsFargeForIAStatusNy = (
    status: IAProsessStatusType,
): TagProps["variant"] => {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return "neutral-moderate";
        case IAProsessStatusEnum.enum.VURDERES:
            return "info-moderate";
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
            return "warning-moderate";
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "alt3-moderate";
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "error-moderate";
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return "alt2-moderate";
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return "success-moderate";
    }
};

export const NyttStatusBadge = ({ status }: Props) => {
    // TODO: Fjern gamle når vi går over på nytt design.
    return (
        <Tag size="small" variant={hentBakgrunnsFargeForIAStatusNy(status)}>
            {penskrivIAStatus(status)}
        </Tag>
    );
};

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

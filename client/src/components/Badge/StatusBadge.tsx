import "@navikt/ds-css";
import React from "react";
import styled from "styled-components";
import { Badge, Farge } from "./Badge";
import { IAProsessStatusEnum, IAProsessStatusType } from "../../domenetyper";


export const hentBakgrunnsFargeForIAStatus = (status: IAProsessStatusType): Farge => {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
            return Farge.hvit
        case IAProsessStatusEnum.enum.VURDERES:
            return Farge.lyseBlå
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
            return Farge.grå
        case IAProsessStatusEnum.enum.KONTAKTES:
            return Farge.mørkeBlå
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return Farge.rød
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return Farge.gul
        case IAProsessStatusEnum.enum.VI_BISTÅR:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return Farge.grønn
    }
}

export function penskrivIAStatus(status: IAProsessStatusType): string {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
            return "Sak opprettet"
        case IAProsessStatusEnum.enum.VURDERES:
            return "Vurderes"
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
            return "Ikke aktiv"
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "Kontaktes"
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "Ikke aktuell"
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return "Kartlegges"
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return "Vi bistår"
        case IAProsessStatusEnum.enum.FULLFØRT:
            return "Fullført"
    }
}

const StyledBadge = styled(Badge)`
  width: 8em;
  flex-shrink: 0;
`;

export const StatusBadge = ({status}: { status: IAProsessStatusType }) =>
    <StyledBadge
        text={penskrivIAStatus(status)}
        backgroundColor={hentBakgrunnsFargeForIAStatus(status)}
    />

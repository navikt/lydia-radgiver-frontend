import "@navikt/ds-css";
import React from "react";
import { Badge } from "./Badge";
import { IAProsessStatusEnum, IAProsessStatusType } from "../../domenetyper/domenetyper";
import { FiaFarger } from "../../styling/farger";

export const hentBakgrunnsFargeForIAStatus = (status: IAProsessStatusType): FiaFarger => {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return FiaFarger.hvit
        case IAProsessStatusEnum.enum.VURDERES:
            return FiaFarger.lyseBlå
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
            return FiaFarger.grå
        case IAProsessStatusEnum.enum.KONTAKTES:
            return FiaFarger.mørkeBlå
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return FiaFarger.rød
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return FiaFarger.gul
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return FiaFarger.grønn
    }
}

export function penskrivIAStatus(status: IAProsessStatusType): string {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
            return "Opprettet"
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

export const StatusBadge = ({status}: { status: IAProsessStatusType }) =>
    <Badge backgroundColor={hentBakgrunnsFargeForIAStatus(status)}>{penskrivIAStatus(status)}</Badge>

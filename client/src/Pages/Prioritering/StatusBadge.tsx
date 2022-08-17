import "@navikt/ds-css";
import React from "react";
import {IAProsessStatusEnum, IAProsessStatusType} from "../../domenetyper";
import {Badge, Farge} from "../../components/Badge/Badge";


export const hentBakgrunnsFargeForIAStatus = (status: IAProsessStatusType): Farge => {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
            return Farge.hvit
        case IAProsessStatusEnum.enum.VURDERES:
            return Farge.lyseBlå
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return Farge.grå
        case IAProsessStatusEnum.enum.KONTAKTES:
            return Farge.mørkeBlå
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return Farge.rød
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return Farge.gul
        case IAProsessStatusEnum.enum.VI_BISTÅR:
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
    <Badge
        text={penskrivIAStatus(status)}
        backgroundColor={hentBakgrunnsFargeForIAStatus(status)}
    />

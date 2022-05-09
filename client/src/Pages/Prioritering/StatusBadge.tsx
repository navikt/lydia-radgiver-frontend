import "@navikt/ds-css";
import React from "react";
import {IAProsessStatusEnum, IAProsessStatusType} from "../../domenetyper";
import {Badge, Farge} from "../../components/Badge/Badge";


export const hentBakgrunnsFargeForIAStatus = (status: IAProsessStatusType): Farge => {
    switch (status) {
        case IAProsessStatusEnum.enum.VURDERES:
            return Farge.lyseBlå
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
            return Farge.hvit
        case IAProsessStatusEnum.enum.KONTAKTES:
            return Farge.mørkeBlå
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return Farge.rød
    }
}

export function penskrivIAStatus(status: IAProsessStatusType): string {
    switch (status) {
        case IAProsessStatusEnum.enum.VURDERES:
            return "Vurderes"
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
            return "Ikke aktiv"
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "Kontaktes"
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "Ikke aktuell"
    }
}

export const StatusBadge = ({status}: { status: IAProsessStatusType }) =>
    <Badge
        text={penskrivIAStatus(status)}
        backgroundColor={hentBakgrunnsFargeForIAStatus(status)}
    />

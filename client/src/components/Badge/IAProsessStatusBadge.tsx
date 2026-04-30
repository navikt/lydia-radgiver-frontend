import {
    IAProsessStatusEnum,
    IAProsessStatusType,
} from "@/domenetyper/domenetyper";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";

export type StatusBadgeProps = Omit<
    GenericProps<IAProsessStatusType>,
    "penskrivStatus" | "hentVariant"
>;
export function IAProsessStatusBadge({ ...remainingProps }: StatusBadgeProps) {
    return (
        <GenericStatusBadge
            {...remainingProps}
            penskrivStatus={penskrivIAStatus}
            hentVariant={hentVariantForIAStatus}
        />
    );
}

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
        case IAProsessStatusEnum.enum.AKTIV:
            return "Aktiv";
        case IAProsessStatusEnum.enum.VURDERT:
            return "Vurdert";
        case IAProsessStatusEnum.enum.AVSLUTTET:
            return "Avsluttet";
        case IAProsessStatusEnum.enum.AVBRUTT:
            return "Avbrutt";
        default:
            return status;
    }
}
export const hentVariantForIAStatus = (status: IAProsessStatusType) => {
    switch (status) {
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
        case IAProsessStatusEnum.enum.AVBRUTT:
        default:
            return "neutral-moderate";
        case IAProsessStatusEnum.enum.AVSLUTTET:
            return "neutral-filled";
        case IAProsessStatusEnum.enum.VURDERES:
            return "alt2";
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "alt3-moderate";
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return "warning-moderate";
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return "success-filled";
        case IAProsessStatusEnum.enum.AKTIV:
            return "alt3";
        case IAProsessStatusEnum.enum.VURDERT:
            return "alt2-filled";
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return "alt1-moderate";
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "error-moderate";
    }
};

import {
    IAProsessStatusEnum,
    IAProsessStatusType,
} from "../../domenetyper/domenetyper";
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
        default:
            return status;
    }
}
export const hentVariantForIAStatus = (status: IAProsessStatusType) => {
    switch (status) {
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
        default:
            return "neutral-moderate";
        case IAProsessStatusEnum.enum.VURDERES:
            return "info-moderate";
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "alt3-moderate";
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return "warning-moderate";
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return "success-filled";
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return "alt1-moderate";
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "error-moderate";
    }
};

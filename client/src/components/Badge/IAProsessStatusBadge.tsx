import { TagProps } from "@navikt/ds-react";
import {
    IAProsessStatusEnum,
    IAProsessStatusType,
} from "../../domenetyper/domenetyper";
import { GenericProps, GenericStatusBadge } from "./StatusBadge";
import { exhaustive } from "../../util/exhaustive_types";

export type StatusBadgeProps = Omit<
    GenericProps<IAProsessStatusType>,
    "penskrivStatus" | "hentTagProps"
>;
export function IAProsessStatusBadge({ ...remainingProps }: StatusBadgeProps) {
    return (
        <GenericStatusBadge
            {...remainingProps}
            penskrivStatus={penskrivIAStatus}
            hentTagProps={hentTagPropsForIAStatus}
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
            exhaustive(status);
            return status;
    }
}

export function hentTagPropsForIAStatus(
    status: IAProsessStatusType,
): Partial<TagProps> {
    switch (status) {
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return { variant: "outline", "data-color": "success" };
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
        case IAProsessStatusEnum.enum.AVBRUTT:
            return { variant: "outline", "data-color": "neutral" };
        case IAProsessStatusEnum.enum.AKTIV:
            return { variant: "outline", "data-color": "brand-blue" };
        // ikke eksisterende
        case IAProsessStatusEnum.enum.AVSLUTTET:
            return { variant: "strong", "data-color": "neutral" };
        case IAProsessStatusEnum.enum.VURDERES:
            return { variant: "moderate", "data-color": "meta-lime" };
        case IAProsessStatusEnum.enum.KONTAKTES:
            return { variant: "strong", "data-color": "brand-blue" };
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return { variant: "moderate", "data-color": "warning" };
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return { variant: "strong", "data-color": "success" };
        case IAProsessStatusEnum.enum.VURDERT:
            return { variant: "strong", "data-color": "meta-lime" };
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return { variant: "strong", "data-color": "danger" };
        default:
            exhaustive(status);
            return {};
    }
}

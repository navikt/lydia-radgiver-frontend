import { IAProsessStatusEnum, IAProsessStatusType, IASak } from "../../../../domenetyper/domenetyper";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import { penskrivIAStatus } from "../../../../components/Badge/IAProsessStatusBadge";
import { Button, Dropdown } from "@navikt/ds-react";

import styles from "./virksomhetsinfoheader.module.scss";


const hentFargeForIAStatus = (
    status: IAProsessStatusType,
) => {
    switch (status) {
        case IAProsessStatusEnum.enum.IKKE_AKTIV:
        case IAProsessStatusEnum.enum.SLETTET:
        default:
            return {
                bakgrunnsfarge: "var(--ac-tag-neutral-moderate-bg, var(--a-surface-neutral-moderate))",
                tekstfarge: "var(--a-text-default)",
            };
        case IAProsessStatusEnum.enum.VURDERES:
            return {
                bakgrunnsfarge: "var(--ac-tag-info-moderate-bg, var(--a-surface-info-moderate))",
                tekstfarge: "var(--a-text-default)",
            };
        case IAProsessStatusEnum.enum.KONTAKTES:
            return {
                bakgrunnsfarge: "var(--ac-tag-alt-3-moderate-bg, var(--a-surface-alt-3-moderate))",
                tekstfarge: "var(--a-text-default)",
            };
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return {
                bakgrunnsfarge: "var(--ac-tag-warning-moderate-bg, var(--a-surface-warning-moderate))",
                tekstfarge: "var(--a-text-default)",
            };
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return {
                bakgrunnsfarge: "var(--ac-tag-success-filled-bg, var(--a-surface-success));",
                tekstfarge: "var(--ac-tag-success-filled-text, var(--a-text-on-success))",
            };
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return {
                bakgrunnsfarge: "var(--ac-tag-alt-1-moderate-bg, var(--a-surface-alt-1-moderate))",
                tekstfarge: "var(--a-text-default)",
            };
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return {
                bakgrunnsfarge: "var(--ac-tag-error-moderate-bg, var(--a-surface-danger-moderate))",
                tekstfarge: "var(--a-text-default)",
            };
    }
};

export function SaksgangDropdownToggle({
    iaSak,
}: {
    iaSak?: IASak | undefined;
}) {
    const safeStatus = iaSak?.status ?? IAProsessStatusEnum.enum.IKKE_AKTIV;
    const farger = hentFargeForIAStatus(safeStatus);
    return (
        <Button
            className={styles.saksgangDropdownToggle}
            style={
                {
                    "--farge": farger.bakgrunnsfarge,
                    "--tekstfarge": farger.tekstfarge,
                    "--hoverfarge": (safeStatus) === IAProsessStatusEnum.enum.IKKE_AKTIV
                        ? "var(--a-gray-200)"
                        : farger.bakgrunnsfarge,
                } as React.CSSProperties
            }
            as={Dropdown.Toggle}
            size={"small"}
            variant="primary"
            iconPosition={"right"}
            icon={<ChevronDownIcon aria-hidden />}>
            {penskrivIAStatus(safeStatus)}
        </Button>
    )
}

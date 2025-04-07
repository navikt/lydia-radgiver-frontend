import { IAProsessStatusEnum, IAProsessStatusType, IASak } from "../../../../domenetyper/domenetyper";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import { penskrivIAStatus } from "../../../../components/Badge/StatusBadge";
import { Button, ButtonProps, Dropdown } from "@navikt/ds-react";
import styled from "styled-components";

const DropdownToggleButton = (props: ButtonProps) => (
    <Button {...props} as={Dropdown.Toggle} />
);

const RegularSortTekstKnapp = styled(DropdownToggleButton) <{
    $farge: string;
    $tekstfarge: string;
}>`
    color: ${(props) => props.$tekstfarge};
    background-color: ${(props) => props.$farge};
    
    &:hover {
        // Må override hoverfargen fra default. Bittelitt hacky, men den gråfargen klarte ikke å bli mørkere med brightness(80%), så den har edge case her.
        background-color: ${(props) => props.$farge === hentFargeForIAStatus(IAProsessStatusEnum.enum.IKKE_AKTIV).bakgrunnsfarge ? "var(--a-gray-200)" : props.$farge};
        filter: brightness(80%);
        opacity: 1;
    }

    & > span {
        font-weight: var(--a-font-weight-regular);
    }
`;

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
    const farger = hentFargeForIAStatus(iaSak?.status ?? "IKKE_AKTIV");
    return (
        <RegularSortTekstKnapp
            $farge={farger.bakgrunnsfarge}
            $tekstfarge={farger.tekstfarge}
            size={"small"}
            variant="primary"
            iconPosition={"right"}
            icon={<ChevronDownIcon aria-hidden />}>
            {penskrivIAStatus(iaSak?.status ?? "IKKE_AKTIV")}
        </RegularSortTekstKnapp>

    );
}

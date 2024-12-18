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
}>`
    color: black;
    background-color: ${(props) => props.$farge};
    
    &:hover {
        // Må override hoverfargen fra default. Bittelitt hacky, men den gråfargen klarte ikke å bli mørkere med brightness(80%), så den har edge case her.
        background-color: ${(props) => props.$farge === hentFargeForIAStatus(IAProsessStatusEnum.enum.IKKE_AKTIV) ? "var(--a-gray-200)" : props.$farge};
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
            return "var(--ac-tag-neutral-moderate-bg, var(--a-surface-neutral-moderate))";
        case IAProsessStatusEnum.enum.VURDERES:
            return "var(--ac-tag-info-moderate-bg, var(--a-surface-info-moderate))";
        case IAProsessStatusEnum.enum.KONTAKTES:
            return "var(--ac-tag-alt-3-moderate-bg, var(--a-surface-alt-3-moderate))";
        case IAProsessStatusEnum.enum.KARTLEGGES:
            return "var(--ac-tag-warning-moderate-bg, var(--a-surface-warning-moderate))";
        case IAProsessStatusEnum.enum.VI_BISTÅR:
            return "var(--ac-tag-success-moderate-bg, var(--a-surface-success-moderate))";
        case IAProsessStatusEnum.enum.NY:
        case IAProsessStatusEnum.enum.FULLFØRT:
            return "var(--ac-tag-alt-1-moderate-bg, var(--a-surface-alt-1-moderate))";
        case IAProsessStatusEnum.enum.IKKE_AKTUELL:
            return "var(--ac-tag-error-moderate-bg, var(--a-surface-danger-moderate))";
    }
};

export function SaksgangDropdownToggle({
    iaSak,
}: {
    iaSak?: IASak | undefined;
}) {
    return (
        <RegularSortTekstKnapp
            $farge={hentFargeForIAStatus(iaSak?.status ?? "IKKE_AKTIV")}
            size={"small"}
            variant="primary"
            iconPosition={"right"}
            icon={<ChevronDownIcon aria-hidden />}>
            {penskrivIAStatus(iaSak?.status ?? "IKKE_AKTIV")}
        </RegularSortTekstKnapp>

    );
}

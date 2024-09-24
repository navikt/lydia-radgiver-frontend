import { IASak } from "../../../../domenetyper/domenetyper";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import { penskrivIAStatus } from "../../../../components/Badge/StatusBadge";
import { Button, ButtonProps, Dropdown } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import { FiaFarger } from "../../../../styling/farger";

const DropdownToggleButton = (props: ButtonProps) => (
    <Button {...props} as={Dropdown.Toggle} />
);

const RegularSortTekstKnapp = styled(DropdownToggleButton)`
    color: black;

    & > span {
        font-weight: var(--a-font-weight-regular);
    }
`;
const IkkeAktivKnapp = styled(RegularSortTekstKnapp)`
    background-color: ${FiaFarger.grå};

    &:hover {
        background-color: #969696; // HSB for grå med -20% Brightness
    }
`;
const VurderesKnapp = styled(RegularSortTekstKnapp)`
    background-color: ${FiaFarger.lyseBlå};

    &:hover {
        background-color: #adc7cc; // HSB for lyseBlå med -20% Brightness
    }
`;
const KontaktesKnapp = styled(RegularSortTekstKnapp)`
    background-color: ${FiaFarger.mørkeBlå};

    &:hover {
        background-color: #a3b4cc; // HSB for mørkeBlå med -20% Brightness
    }
`;
const KartleggesKnapp = styled(RegularSortTekstKnapp)`
    background-color: ${FiaFarger.gul};

    &:hover {
        background-color: #ccab7a; // HSB for gul med -20% Brightness
    }
`;
const ViBistårKnapp = styled(RegularSortTekstKnapp)`
    background-color: ${FiaFarger.grønn};

    &:hover {
        background-color: #76ab85; // HSB for grønn med -20% Brightness
    }
`;

export function SaksgangDropdownToggle({
    iaSak,
}: {
    iaSak?: IASak | undefined;
}) {
    switch (iaSak?.status) {
        case undefined:
            return (
                <IkkeAktivKnapp
                    size={"small"}
                    variant={"primary"}
                    iconPosition={"right"}
                    icon={<ChevronDownIcon />}
                >
                    Ikke aktiv
                </IkkeAktivKnapp>
            );
        case "VURDERES":
            return (
                <VurderesKnapp
                    size={"small"}
                    variant={"primary"}
                    iconPosition={"right"}
                    icon={<ChevronDownIcon />}
                >
                    {penskrivIAStatus(iaSak.status)}
                </VurderesKnapp>
            );
        case "KONTAKTES":
            return (
                <KontaktesKnapp
                    size={"small"}
                    variant={"primary"}
                    iconPosition={"right"}
                    icon={<ChevronDownIcon />}
                >
                    {penskrivIAStatus(iaSak.status)}
                </KontaktesKnapp>
            );
        case "KARTLEGGES":
            return (
                <KartleggesKnapp
                    size={"small"}
                    variant={"primary"}
                    iconPosition={"right"}
                    icon={<ChevronDownIcon />}
                >
                    {penskrivIAStatus(iaSak.status)}
                </KartleggesKnapp>
            );
        case "VI_BISTÅR":
            return (
                <ViBistårKnapp
                    size={"small"}
                    variant={"primary"}
                    iconPosition={"right"}
                    icon={<ChevronDownIcon />}
                >
                    {penskrivIAStatus(iaSak.status)}
                </ViBistårKnapp>
            );
        case "FULLFØRT":
            return (
                <IkkeAktivKnapp
                    size={"small"}
                    variant={"primary"}
                    iconPosition={"right"}
                    icon={<ChevronDownIcon />}
                >
                    {penskrivIAStatus(iaSak.status)}
                </IkkeAktivKnapp>
            );
    }
}

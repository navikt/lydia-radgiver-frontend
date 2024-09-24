import {
    GyldigNesteHendelse,
    IASak,
} from "../../../../domenetyper/domenetyper";
import React from "react";
import {
    Button,
    ButtonProps,
    Dropdown,
    Heading,
    HStack,
} from "@navikt/ds-react";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import Historikk from "../IASakStatus/EndreStatusModal/Historikk";
import {
    StatusHendelseSteg,
    Statusknapper,
} from "../IASakStatus/EndreStatusModal/Statusknapper";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { penskrivIAStatus } from "../../../../components/Badge/StatusBadge";
import { FiaFarger } from "../../../../styling/farger";
import {
    useHentAktivSakForVirksomhet,
    useHentSamarbeidshistorikk,
} from "../../../../api/lydia-api";

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

const HistorikkContainer = styled(HStack)<{ $begrensHøyde: boolean }>`
    max-height: ${(props) => (props.$begrensHøyde ? "20rem" : "auto")};
    overflow-y: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
`;

const DropdownHeader = styled(Heading)`
    padding-top: 1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 1rem;
`;

export function SaksgangDropdown({
    virksomhet,
    iaSak,
    setVisKonfetti,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    setVisKonfetti?: (visKonfetti: boolean) => void;
}) {
    const [open, setOpen] = React.useState(false);

    const [nesteSteg, setNesteSteg] = React.useState<{
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }>({ nesteSteg: null, hendelse: null });

    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(
        virksomhet.orgnr,
    );
    const { mutate: mutateAktivSak } = useHentAktivSakForVirksomhet(
        virksomhet.orgnr,
    );

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateAktivSak?.();
        mutateSamarbeidshistorikk?.();
    };

    return (
        <Dropdown
            open={open}
            onOpenChange={(newOpen) => {
                setOpen(newOpen);
            }}
        >
            <StyledStatusKnapp iaSak={iaSak} />
            <Dropdown.Menu
                style={{ maxWidth: "auto", width: "36rem" }}
                placement="bottom-start"
            >
                <DropdownHeader size="medium">Endre status</DropdownHeader>
                <HistorikkContainer
                    $begrensHøyde={nesteSteg.nesteSteg !== null}
                >
                    {iaSak && <Historikk sak={iaSak} />}
                </HistorikkContainer>
                <Statusknapper
                    virksomhet={virksomhet}
                    onStatusEndret={() => {
                        mutateIASakerOgSamarbeidshistorikk();
                    }}
                    setModalOpen={setOpen}
                    iaSak={iaSak}
                    setVisKonfetti={setVisKonfetti}
                    nesteSteg={nesteSteg}
                    setNesteSteg={setNesteSteg}
                />
            </Dropdown.Menu>
        </Dropdown>
    );
}

function StyledStatusKnapp({ iaSak }: { iaSak?: IASak | undefined }) {
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
        default:
            return (
                <Button
                    size={"small"}
                    variant={"primary"}
                    iconPosition={"right"}
                    icon={<ChevronDownIcon />}
                >
                    Uventet status {iaSak?.status}
                </Button>
            );
    }
}

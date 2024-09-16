import {
    GyldigNesteHendelse,
    IASak,
} from "../../../../domenetyper/domenetyper";
import React from "react";
import { Button, Heading, Modal } from "@navikt/ds-react";
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
import { useHentAktivSakForVirksomhet } from "../../../../api/lydia-api";

export function EndreStatusKnapp({
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

    const { mutate: mutateIaSaker } = useHentAktivSakForVirksomhet(
        virksomhet.orgnr,
    );

    function StatusKnapp({ iaSak }: { iaSak?: IASak | undefined }) {
        const StyledStatusKnapp = styled(Button)`
            color: black;

            & > span {
                font-weight: var(--a-font-weight-regular);
            }
        `;
        const IkkeAktivKnapp = styled(StyledStatusKnapp)`
            background-color: ${FiaFarger.grå};

            &:hover {
                background-color: #969696; // HSB for grå med -20% Brightness
            }
        `;
        const VurderesKnapp = styled(StyledStatusKnapp)`
            background-color: ${FiaFarger.lyseBlå};

            &:hover {
                background-color: #adc7cc; // HSB for lyseBlå med -20% Brightness
            }
        `;
        const KontaktesKnapp = styled(StyledStatusKnapp)`
            background-color: ${FiaFarger.mørkeBlå};

            &:hover {
                background-color: #a3b4cc; // HSB for mørkeBlå med -20% Brightness
            }
        `;
        const KartleggesKnapp = styled(StyledStatusKnapp)`
            background-color: ${FiaFarger.gul};

            &:hover {
                background-color: #ccab7a; // HSB for gul med -20% Brightness
            }
        `;
        const ViBistårKnapp = styled(StyledStatusKnapp)`
            background-color: ${FiaFarger.grønn};

            &:hover {
                background-color: #76ab85; // HSB for grønn med -20% Brightness
            }
        `;

        switch (iaSak?.status) {
            case undefined:
                return (
                    <IkkeAktivKnapp
                        size={"small"}
                        variant={"primary"}
                        iconPosition={"right"}
                        icon={<ChevronDownIcon />}
                        onClick={() => setOpen(true)}
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
                        onClick={() => setOpen(true)}
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
                        onClick={() => setOpen(true)}
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
                        onClick={() => setOpen(true)}
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
                        onClick={() => setOpen(true)}
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
                        onClick={() => setOpen(true)}
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
                        onClick={() => setOpen(true)}
                    >
                        {iaSak?.status}
                    </Button>
                );
        }
    }

    return (
        <>
            <StatusKnapp iaSak={iaSak}></StatusKnapp>
            <Modal
                open={open}
                closeOnBackdropClick={true}
                style={{ minWidth: "36rem" }}
                onClose={() => {
                    setOpen(false);
                    setNesteSteg({ nesteSteg: null, hendelse: null });
                }}
                aria-label="Endre status"
            >
                <Modal.Header>
                    <Heading size="medium">Endre status</Heading>
                </Modal.Header>
                <Modal.Body
                    style={
                        nesteSteg.nesteSteg === null
                            ? {}
                            : { maxHeight: "20rem" }
                    }
                >
                    {iaSak && <Historikk sak={iaSak} />}
                </Modal.Body>

                <Statusknapper
                    virksomhet={virksomhet}
                    onStatusEndret={() => {
                        setOpen(false);
                        mutateIaSaker();
                    }}
                    iaSak={iaSak}
                    setModalOpen={setOpen}
                    setVisKonfetti={setVisKonfetti}
                    nesteSteg={nesteSteg}
                    setNesteSteg={setNesteSteg}
                />
            </Modal>
        </>
    );
}

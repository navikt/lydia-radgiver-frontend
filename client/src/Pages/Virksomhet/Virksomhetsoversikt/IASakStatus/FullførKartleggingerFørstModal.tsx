import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../../components/Modal/ModalKnapper";
import { StyledModal } from "../../../../components/Modal/StyledModal";
import { loggSendBrukerTilKartleggingerTab } from "../../../../util/amplitude-klient";
import { useSendTilKartleggingerTab } from "../../../../util/useSendTilKartleggingerTab";

interface Props {
    visModal: boolean;
    lukkModal: () => void;
}

export const FullførKartleggingerFørstModal = ({
    visModal,
    lukkModal,
}: Props) => {
    const { sendBrukerTilKartleggingerTab } = useSendTilKartleggingerTab();

    return (
        <StyledModal
            open={visModal}
            onClose={lukkModal}
            header={{ heading: "Saken har kartlegginger som ikke er fullført" }}
        >
            <Modal.Body>
                <BodyLong>
                    For å gå videre må du fullføre kartleggingene. Hvis en
                    kartlegging ikke skal eller kan gjennomføres likevel må du
                    slette den før du kan gå videre.
                </BodyLong>
                <br />
                <ModalKnapper>
                    <Button variant="secondary" onClick={lukkModal}>
                        Den er grei
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            sendBrukerTilKartleggingerTab();
                            loggSendBrukerTilKartleggingerTab(
                                "fullfør kartlegginger",
                            );
                            lukkModal();
                        }}
                    >
                        Ta meg til kartlegginger
                    </Button>
                </ModalKnapper>
            </Modal.Body>
        </StyledModal>
    );
};

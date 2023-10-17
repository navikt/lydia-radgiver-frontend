import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../../components/Modal/ModalKnapper";
import { StyledModal } from "../../../../components/Modal/StyledModal";

interface Props {
    visModal: boolean;
    lukkModal: () => void;
}

export const LeggTilLeveranserFørstModal = ({ visModal, lukkModal }: Props) => {
    return (
        <StyledModal
            open={visModal}
            onClose={lukkModal}
            header={{ heading: "Saken har ingen IA-tjenester" }}>
            <Modal.Body>
                <BodyLong>
                    For å gå videre må du registrere og levere minst én IA-tjeneste på saken.
                </BodyLong>
                <br />
                <ModalKnapper>
                    <Button variant="secondary" onClick={lukkModal}>
                        Den er grei
                    </Button>
                </ModalKnapper>
            </Modal.Body>
        </StyledModal>
    )
}

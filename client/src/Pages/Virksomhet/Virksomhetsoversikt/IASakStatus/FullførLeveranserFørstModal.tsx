import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../../components/Modal/ModalKnapper";
import { StyledModal } from "../../../../components/Modal/StyledModal";

interface Props {
    visModal: boolean;
    lukkModal: () => void;
}

export const FullførLeveranserFørstModal = ({visModal, lukkModal}: Props) => {
    return (
        <StyledModal open={visModal} onClose={lukkModal} header={{heading: "Saken har leveranser som ikke er levert"}}>
            <Modal.Body>
                <BodyLong>
                    For å gå videre må du markere utførte leveranser som levert. Dersom en leveranse ikke skal utføres
                    likevel kan du slette den fra planen.
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

import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { getRootElement } from "../../../../main";
import { ModalKnapper } from "../../../../components/Modal/ModalKnapper";
import { StyledModal } from "../../../../components/Modal/StyledModal";

interface Props {
    visModal: boolean;
    lukkModal: () => void;
}

export const FullførLeveranserFørstModal = ({visModal, lukkModal}: Props) => {
    return (
        <StyledModal parentSelector={() => getRootElement()}
                     open={visModal}
                     onClose={lukkModal}>
            <Modal.Content>
                <Heading size="medium" spacing>Saken har leveranser som ikke er fullført</Heading>
                <BodyLong>For å lukke saken må du fullføre leveransene som er planlagt for saken. Dersom en
                    leveranse ikke skal utføres
                    likevel kan du slette den fra planen.</BodyLong>

                <br />
                <ModalKnapper>
                    <Button
                        variant="secondary"
                        onClick={lukkModal}
                    >
                        Den er grei
                    </Button>
                </ModalKnapper>
            </Modal.Content>
        </StyledModal>
    )
}

import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { getRootElement } from "../../main";
import { StyledModal } from "./StyledModal";
import { ModalKnapper } from "./ModalKnapper";

export interface Props {
    onConfirm: () => void
    onCancel: () => void
    åpen: boolean,
    title?: string,
    description?: string
}

export const BekreftValgModal = ({
    onConfirm,
    onCancel,
    åpen,
    title = "Er du sikker på at du vil gjøre dette?",
    description
}: Props) => {
    Modal.setAppElement?.(document.body)
    return (
        <StyledModal parentSelector={() => getRootElement()}
                     open={åpen}
                     onClose={onCancel}>
            <Modal.Content>
                <Heading size="medium" spacing>{title}</Heading>
                {description && <BodyLong>{description}</BodyLong>}
                <br />
                <ModalKnapper>
                    <Button onClick={onConfirm}>Ja</Button>
                    <Button variant="secondary" onClick={onCancel}>Avbryt</Button>
                </ModalKnapper>
            </Modal.Content>
        </StyledModal>
    );
}

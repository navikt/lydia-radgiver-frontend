import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { StyledModal } from "./StyledModal";
import { ModalKnapper } from "./ModalKnapper";
import { useEffect } from "react";

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
    title,
    description
}: Props) => {
    useEffect(() => {
        Modal.setAppElement(document.getElementById("root"));
    }, []);

    return (
        <StyledModal
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

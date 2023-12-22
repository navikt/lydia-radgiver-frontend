import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { StyledModal } from "./StyledModal";
import { ModalKnapper } from "./ModalKnapper";

interface Props {
    onConfirm: () => void
    onCancel: () => void
    åpen: boolean,
    title: string,
    description: string,
    children?: React.ReactNode,
    className?: string,
    laster?: boolean
}

export const BekreftValgModal = ({
    onConfirm,
    onCancel,
    åpen,
    title,
    description,
    children,
    laster,
    ...rest
}: Props) => {
    return (
        <StyledModal open={åpen} onClose={onCancel} header={{ heading: title }} {...rest}>
            <Modal.Body>
                <BodyLong>{description}</BodyLong>
                {children}
                <br />
                <ModalKnapper>
                    <Button onClick={onConfirm} disabled={laster} loading={laster}>Ja</Button>
                    <Button variant="secondary" onClick={onCancel}>Avbryt</Button>
                </ModalKnapper>
            </Modal.Body>
        </StyledModal>
    );
}

import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { StyledModal } from "./StyledModal";
import { ModalKnapper } from "./ModalKnapper";

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
    åpen: boolean;
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
    laster?: boolean;
    jaTekst?: string;
    neiTekst?: string;
}

export const BekreftValgModal = ({
    onConfirm,
    onCancel,
    åpen,
    title,
    description,
    children,
    laster,
    jaTekst = "Ja",
    neiTekst = "Avbryt",
    ...rest
}: Props) => {
    return (
        <StyledModal
            open={åpen}
            onClose={onCancel}
            header={{ heading: title }}
            {...rest}
        >
            <Modal.Body>
                {description && <BodyLong>{description}</BodyLong>}
                {children}
                <br />
                <ModalKnapper>
                    <Button variant="secondary" onClick={onCancel}>
                        {neiTekst}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={laster}
                        loading={laster}
                    >
                        {jaTekst}
                    </Button>
                </ModalKnapper>
            </Modal.Body>
        </StyledModal>
    );
};

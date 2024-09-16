import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { Button, Modal } from "@navikt/ds-react";
import { StyledModal } from "../../../components/Modal/StyledModal";

interface EndreSamarbeidModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    samarbeid: IaSakProsess;
}

export const EndreSamarbeidModal = ({
    open,
    setOpen,
    samarbeid,
}: EndreSamarbeidModalProps) => {
    const navn = samarbeid?.navn || "Samarbeid uten navn";

    return (
        <StyledModal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            header={{
                heading: `Endre samarbeid "${navn}"`,
                size: "medium",
                closeButton: true,
            }}
            width="medium"
        >
            <Modal.Footer>
                <Button
                    type="button"
                    iconPosition="right"
                    onClick={() => setOpen(false)}
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </StyledModal>
    );
};

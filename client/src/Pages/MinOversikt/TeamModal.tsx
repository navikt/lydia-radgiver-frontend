import { BodyLong, Button, Modal } from "@navikt/ds-react";
import PropTypes from "prop-types";

interface TeamModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TeamModal: React.FC<TeamModalProps> = ({ open, setOpen }) => {
    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                header={{
                    heading: "Er du sikker?",
                    size: "small",
                    closeButton: false,
                }}
                width="small"
            >
                <Modal.Body>
                    <BodyLong>
                        Culpa aliquip ut cupidatat laborum minim quis ex in
                        aliqua. Qui incididunt dolor do ad ut. Incididunt
                        eiusmod nostrud deserunt duis laborum.
                    </BodyLong>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={() => setOpen(false)}
                    >
                        Ja, jeg er sikker
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

TeamModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

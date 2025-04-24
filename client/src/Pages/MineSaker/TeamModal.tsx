import { Button, Modal } from "@navikt/ds-react";
import styled from "styled-components";
import { useHentMineSaker } from "../../api/lydia-api/sak";
import { IASak } from "../../domenetyper/domenetyper";
import TeamInnhold from "./TeamInnhold";
import { TaEierskapModal } from "./TaEierSkapModal";
import React from "react";

const ModalBodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3rem;
`;

interface TeamModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    iaSak: IASak;
}

export const TeamModal = ({ open, setOpen, iaSak }: TeamModalProps) => {
    const { mutate: muterMineSaker } = useHentMineSaker();
    const [taEierskapModalÅpen, setTaEierskapModalÅpen] = React.useState(false);

    return (
        <>
            <Modal
                closeOnBackdropClick={true}
                open={open}
                onClose={() => {
                    muterMineSaker();
                    setOpen(false);
                }}
                header={{
                    heading: "Administrer gruppe",
                    size: "small",
                    closeButton: true,
                }}
                width="small"
            >
                <Modal.Body>
                    <ModalBodyWrapper>
                        <TeamInnhold iaSak={iaSak} setTaEierskapModalÅpen={setTaEierskapModalÅpen} taEierskapModalÅpen={taEierskapModalÅpen} />
                    </ModalBodyWrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        iconPosition="right"
                        onClick={() => setOpen(false)}
                    >
                        Ferdig
                    </Button>
                </Modal.Footer>
            </Modal>
            <TaEierskapModal
                erModalÅpen={taEierskapModalÅpen}
                lukkModal={() => setTaEierskapModalÅpen(false)}
                iaSak={iaSak}
            />
        </>
    );
};

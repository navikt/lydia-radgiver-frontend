import { Button, Modal } from "@navikt/ds-react";
import styled from "styled-components";
import { useHentMineSaker } from "../../api/lydia-api/sak";
import { IASak } from "../../domenetyper/domenetyper";
import TeamInnhold from "./TeamInnhold";
import React from "react";
import { TaEierskapModal } from "./TaEierSkapModal";

const ModalBodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3rem;
`;

interface TeamModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    iaSak: IASak;
    erPåMineSaker?: boolean;
}

export const TeamModal = ({ open, setOpen, iaSak, erPåMineSaker = false }: TeamModalProps) => {
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
                        <TeamInnhold iaSak={iaSak} lukkEksternContainer={() => setOpen(false)} erPåMineSaker={erPåMineSaker} åpneTaEierskapModal={() => setTaEierskapModalÅpen(true)} />
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
                lukkModal={() => {
                    setTaEierskapModalÅpen(false);
                    setOpen(false);
                }}
                iaSak={iaSak}
            />
        </>
    );
};

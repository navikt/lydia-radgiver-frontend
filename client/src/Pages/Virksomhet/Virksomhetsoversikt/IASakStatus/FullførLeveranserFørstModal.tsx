import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../../components/Modal/ModalKnapper";
import { StyledModal } from "../../../../components/Modal/StyledModal";
import {useSendTilIATjenesterTab} from "../../../../util/useSendTilIATjenesterTab";

interface Props {
    visModal: boolean;
    lukkModal: () => void;
}

export const FullførLeveranserFørstModal = ({ visModal, lukkModal }: Props) => {
    const { erPåIaTjenesterFane, sendBrukerTilIATjenesterTab } = useSendTilIATjenesterTab();

    return (
        <StyledModal
            open={visModal}
            onClose={lukkModal}
            header={{ heading: "Saken har IA-tjenester som ikke er levert" }}
        >
            <Modal.Body>
                <BodyLong>
                    For å gå videre må du bekrefte at IA-tjenester er levert. Hvis en IA-tjeneste ikke skal utføres
                    likevel må du slette den før du kan sette saken til fullført.
                </BodyLong>
                <br />
                <ModalKnapper>
                    <Button variant="secondary" onClick={lukkModal}>
                        Den er grei
                    </Button>
                    {
                        !erPåIaTjenesterFane && (
                            <Button variant="primary" onClick={() => {
                                sendBrukerTilIATjenesterTab();
                                lukkModal();
                            }}>
                                Ta meg til IA-tjenester
                            </Button>
                        )
                    }
                </ModalKnapper>
            </Modal.Body>
        </StyledModal>
    )
}

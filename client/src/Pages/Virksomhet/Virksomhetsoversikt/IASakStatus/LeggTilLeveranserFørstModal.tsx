import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../../components/Modal/ModalKnapper";
import { StyledModal } from "../../../../components/Modal/StyledModal";
import { useSendTilIATjenesterTab } from "../../../../util/useSendTilIATjenesterTab";
import { loggSendBrukerTilAITjenesterTab } from "../../../../util/amplitude-klient";

interface Props {
    visModal: boolean;
    lukkModal: () => void;
}

export const LeggTilLeveranserFørstModal = ({ visModal, lukkModal }: Props) => {
    const { erPåIaTjenesterFane, sendBrukerTilIATjenesterTab } = useSendTilIATjenesterTab();
    return (
        <StyledModal
            open={visModal}
            onClose={lukkModal}
            header={{ heading: "Saken har ingen IA-tjenester" }}>
            <Modal.Body>
                <BodyLong>
                    For å gå videre må du registrere og levere minst én IA-tjeneste på saken.
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
                                loggSendBrukerTilAITjenesterTab('legg til leveranser');
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

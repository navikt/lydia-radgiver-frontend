import { useState } from "react";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { GyldigNesteHendelse, IASak } from "../../../../../domenetyper/domenetyper";
import { HendelseMåBekreftesKnapp } from "./HendelseMåBekreftesKnapp";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { StyledModal } from "../../../../../components/Modal/StyledModal";
import { getRootElement } from "../../../../../main";
import { ModalKnapper } from "../../../../../components/Modal/ModalKnapper";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
}

export const FullførKnapp = ({hendelse, sak}: Props) => {
    const visFullførtDialogFeatureToggle = false; // TODO denne skal vere "false" til ting er klart

    // Om nokon leveransar ikkje er fullført
    // vis knapp med modal
    const [visFullførLeveranserFørstModal, setFullførLeveranserFørstModal] = useState(false);
    const visModal = () => setFullførLeveranserFørstModal(true);
    const lukkModal = () => setFullførLeveranserFørstModal(false);

    if (visFullførtDialogFeatureToggle) {
        return (
            <>
                <IASakshendelseKnapp
                    hendelsesType={hendelse.saksHendelsestype}
                    onClick={visModal}
                />
                <StyledModal parentSelector={() => getRootElement()} open={visFullførLeveranserFørstModal}
                             onClose={lukkModal}>
                    <Modal.Content>
                        <Heading size="medium" spacing>Saken har leveranser som ikke er fullført</Heading>
                        <BodyLong>For å lukke saken må du fullføre leveransene. Dersom leveransen ikke skal utføres likevel sletter du den fra planen.</BodyLong>

                        <br />
                        <ModalKnapper>
                            <Button
                                variant="secondary"
                                onClick={lukkModal}
                            >
                                Den er grei
                            </Button>
                        </ModalKnapper>
                    </Modal.Content>
                </StyledModal>
            </>
        )
    }

    // Om alt er fint og greit slik det skal vere
    return (
        <HendelseMåBekreftesKnapp hendelse={hendelse} sak={sak} />
    )
}

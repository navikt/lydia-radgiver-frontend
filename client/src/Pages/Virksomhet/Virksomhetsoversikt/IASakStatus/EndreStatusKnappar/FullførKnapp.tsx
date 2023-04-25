import { useState } from "react";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { GyldigNesteHendelse, IASak } from "../../../../../domenetyper/domenetyper";
import { HendelseMåBekreftesKnapp } from "./HendelseMåBekreftesKnapp";
import { IASakshendelseKnapp } from "./IASakshendelseKnapp";
import { StyledModal } from "../../../../../components/Modal/StyledModal";
import { getRootElement } from "../../../../../main";
import { ModalKnapper } from "../../../../../components/Modal/ModalKnapper";
import { useHentLeveranser } from "../../../../../api/lydia-api";

interface Props {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
}

export const FullførKnapp = ({hendelse, sak}: Props) => {
    const {data: leveranserPåSak} = useHentLeveranser(sak.orgnr, sak.saksnummer);
    const harBareFullførteLeveranser = leveranserPåSak?.flatMap((iaTjeneste) => iaTjeneste.leveranser)
        .some((leveranse) => leveranse.status === "LEVERT")
    const [visModal, setVisModal] = useState(false);

    // Om alt er fint og greit slik det skal vere
    if (harBareFullførteLeveranser) {
        return (
            <HendelseMåBekreftesKnapp hendelse={hendelse} sak={sak} />
        )
    }

    return (
        <>
            <IASakshendelseKnapp
                hendelsesType={hendelse.saksHendelsestype}
                onClick={() => setVisModal(true)}
            />
            <StyledModal parentSelector={() => getRootElement()}
                         open={visModal}
                         onClose={() => setVisModal(false)}>
                <Modal.Content>
                    <Heading size="medium" spacing>Saken har leveranser som ikke er fullført</Heading>
                    <BodyLong>For å lukke saken må du fullføre leveransene som er planlagt for saken. Dersom en
                        leveranse ikke skal utføres
                        likevel kan du slette den fra planen.</BodyLong>

                    <br />
                    <ModalKnapper>
                        <Button
                            variant="secondary"
                            onClick={() => setVisModal(false)}
                        >
                            Den er grei
                        </Button>
                    </ModalKnapper>
                </Modal.Content>
            </StyledModal>
        </>
    )
}

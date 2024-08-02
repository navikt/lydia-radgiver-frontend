import React from "react";
import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { StyledModal } from "../../../components/Modal/StyledModal";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import { PlusIcon } from "@navikt/aksel-icons";
import { PlanRessurs } from "../../../domenetyper/plan";
import { VerktøyListe } from "./VerktøyListe";

const StyledBody = styled(BodyLong)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
    width: fit-content;
`;

export default function LeggTilVerktøy({
    verktøy,
}: {
    verktøy: PlanRessurs[];
}) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [minVerktøyliste, setMinVerktøyliste] =
        React.useState<PlanRessurs[]>(verktøy);

    React.useEffect(() => {
        if (
            minVerktøyliste?.[minVerktøyliste.length - 1]?.beskrivelse !== "" ||
            minVerktøyliste?.[minVerktøyliste.length - 1]?.url !== ""
        ) {
            setMinVerktøyliste([
                ...minVerktøyliste,
                { id: 0, beskrivelse: "", url: "" },
            ]);
        }
    }, [minVerktøyliste]);

    return (
        <>
            <StyledButton
                size="small"
                onClick={() => setModalOpen(true)}
                icon={<PlusIcon />}
                variant="secondary"
                iconPosition="right"
            >
                Legg til verktøy
            </StyledButton>
            <StyledModal
                width="medium"
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                header={{ heading: "Legg til verktøy og ressurser" }}
            >
                <Modal.Body>
                    <StyledBody>
                        Her kan du dele ressurser med virksomheten ved å laste
                        opp relevante lenker til temaet. Vær sikker på at du
                        laster opp riktig lenke før du lagrer.
                    </StyledBody>
                    <VerktøyListe
                        minVerktøyliste={minVerktøyliste}
                        setMinVerktøyliste={setMinVerktøyliste}
                    />
                    <ModalKnapper>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setMinVerktøyliste(verktøy);
                                setModalOpen(false);
                            }}
                        >
                            Avbryt
                        </Button>
                        <Button
                            onClick={() => {
                                setModalOpen(false);
                            }}
                        >
                            Lagre
                        </Button>
                    </ModalKnapper>
                </Modal.Body>
            </StyledModal>
        </>
    );
}

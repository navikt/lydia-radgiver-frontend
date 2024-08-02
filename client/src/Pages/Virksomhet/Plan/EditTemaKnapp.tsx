import React from "react";
import { Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import { mobileAndUp } from "../../../styling/breakpoints";
import { DocPencilIcon } from "@navikt/aksel-icons";
import UndertemaSetup from "./UndertemaSetup";
import { PlanTema } from "../../../domenetyper/plan";
import { endreTema } from "../../../api/lydia-api";

const EditTemaModal = styled(Modal)`
    padding: 0;
    max-width: 64rem;
    --a-spacing-6: 0.5rem;

    ${mobileAndUp} {
        padding: 1.5rem;
        --a-spacing-6: var(--a-spacing-6);
        // Vi prøver å hente ut originalverdien frå designsystemet
    }
`;

export default function EditTemaKnapp({
    tema,
    orgnummer,
    saksnummer,
}: {
    tema: PlanTema;
    orgnummer: string;
    saksnummer: string;
}) {
    const [modalOpen, setModalOpen] = React.useState(false);

    const lagreEndring = () => {
        endreTema(orgnummer, saksnummer, tema).then(() => {
            console.log("Endret plan");
        });
    };

    return (
        <>
            <Button
                variant="tertiary"
                onClick={() => setModalOpen(true)}
                icon={<DocPencilIcon />}
            >
                Rediger tema
            </Button>
            <EditTemaModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-label="Rediger tema"
            >
                <Modal.Body>
                    <UndertemaSetup tema={tema} />
                    <br />
                    <ModalKnapper>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setModalOpen(false);
                            }}
                        >
                            Avbryt
                        </Button>
                        <Button
                            onClick={() => {
                                setModalOpen(false);
                                lagreEndring();
                            }}
                        >
                            Lagre
                        </Button>
                    </ModalKnapper>
                </Modal.Body>
            </EditTemaModal>
        </>
    );
}

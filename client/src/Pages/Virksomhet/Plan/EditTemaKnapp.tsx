import React from "react";
import { Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import { mobileAndUp } from "../../../styling/breakpoints";
import { DocPencilIcon } from "@navikt/aksel-icons";
import UndertemaSetup from "./UndertemaSetup";
import { Plan, PlanTema, PlanUndertema } from "../../../domenetyper/plan";
import { endreTema } from "../../../api/lydia-api";
import { lagRequest, UndertemaRequest } from "./Requests";
import { KeyedMutator } from "swr";

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
    hentPlanIgjen,
}: {
    tema: PlanTema;
    orgnummer: string;
    saksnummer: string;
    hentPlanIgjen: KeyedMutator<Plan>;
}) {
    const [modalOpen, setModalOpen] = React.useState(false);

    const [redigertTema, setRedigertTema] = React.useState<PlanTema>(tema);

    const lagreEndring = () => {
        const undertemaer: UndertemaRequest[] = lagRequest(
            redigertTema.undertemaer,
        );
        endreTema(orgnummer, saksnummer, tema.id, undertemaer).then(() => {
            hentPlanIgjen();
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
                    <UndertemaSetup
                        valgteUndertemaer={redigertTema.undertemaer}
                        velgUndertemaer={(
                            redigerteUndertemaer: PlanUndertema[],
                        ) => {
                            setRedigertTema({
                                ...redigertTema,
                                undertemaer: redigerteUndertemaer,
                            });
                        }}
                    />
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

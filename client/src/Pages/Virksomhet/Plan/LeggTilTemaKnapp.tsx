import React from "react";
import { Button, Checkbox, CheckboxGroup, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import UndertemaSetup from "./UndertemaSetup";
import styled from "styled-components";
import { PlanTema } from "../../../domenetyper/plan";

const UndertemaSetupContainer = styled.div`
    margin-bottom: 1rem;
    padding: 1rem;
    margin-left: 2rem;
    background-color: var(--a-surface-subtle);
    border-radius: var(--a-border-radius-medium);
`;

const LeggTilTemaModal = styled(Modal)`
    max-width: 72rem;
`;

export default function LeggTilTemaKnapp({ temaer }: { temaer: PlanTema[] }) {
    const [modalOpen, setModalOpen] = React.useState(false);

    // const valgteTemaer = temaer.filter((tema) => tema.planlagt);
    const handleChange = (val: string[]) => console.log(val);

    return (
        <>
            <Button
                onClick={() => setModalOpen(true)}
                disabled={temaer.filter((tema) => tema.planlagt).length === 3}
            >
                Legg til tema
            </Button>
            <LeggTilTemaModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-label="Legg til tema"
            >
                <Modal.Body>
                    <CheckboxGroup
                        legend="Velg tema i samarbeidsplan"
                        description="Velg hvilke temaer dere skal jobbe med under samarbeidsperioden"
                        onChange={handleChange}
                    >
                        {temaer.map((tema) => (
                            <>
                                <Checkbox key={tema.id} value={tema.id}>
                                    {tema.navn}
                                </Checkbox>
                                {tema.planlagt && (
                                    <UndertemaSetupContainer>
                                        <UndertemaSetup tema={tema} />
                                    </UndertemaSetupContainer>
                                )}
                            </>
                        ))}
                    </CheckboxGroup>
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
                            }}
                        >
                            Lagre
                        </Button>
                    </ModalKnapper>
                </Modal.Body>
            </LeggTilTemaModal>
        </>
    );
}

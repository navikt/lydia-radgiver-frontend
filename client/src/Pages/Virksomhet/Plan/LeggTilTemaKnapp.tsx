import React from "react";
import { Button, Checkbox, CheckboxGroup, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import UndertemaSetup from "./UndertemaSetup";
import styled from "styled-components";
import { Plan, PlanTema, PlanUndertema } from "../../../domenetyper/plan";
import { endrePlan } from "../../../api/lydia-api";
import { lagRequest, TemaRequest } from "./Requests";
import { KeyedMutator } from "swr";

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

export default function LeggTilTemaKnapp({
    saksnummer,
    orgnummer,
    temaer,
    hentPlanIgjen,
}: {
    orgnummer: string;
    saksnummer: string;
    temaer: PlanTema[];
    hentPlanIgjen: KeyedMutator<Plan>;
}) {
    const [modalOpen, setModalOpen] = React.useState(false);

    const [redigertTemaliste, setRedigertTemaliste] =
        React.useState<PlanTema[]>(temaer);

    function velgTema(valgteTemaIder: number[]) {
        setRedigertTemaliste(
            redigertTemaliste.map((tema) =>
                valgteTemaIder.includes(tema.id)
                    ? { ...tema, planlagt: true }
                    : {
                          ...tema,
                          planlagt: false,
                          undertemaer: tema.undertemaer.map((undertema) => {
                              return {
                                  ...undertema,
                                  planlagt: false,
                                  status: null,
                                  startDato: null,
                                  sluttDato: null,
                              };
                          }),
                      },
            ),
        );
    }

    function velgUndertema(
        temaId: number,
        redigerteUndertemaer: PlanUndertema[],
    ) {
        setRedigertTemaliste(
            redigertTemaliste.map((tema) =>
                tema.id === temaId
                    ? {
                          ...tema,
                          undertemaer: redigerteUndertemaer,
                      }
                    : { ...tema },
            ),
        );
    }

    function lagreEndring() {
        const temaer: TemaRequest[] = redigertTemaliste.map((tema) => {
            return {
                id: tema.id,
                planlagt: tema.planlagt,
                undertemaer: lagRequest(tema.undertemaer),
            };
        });

        endrePlan(orgnummer, saksnummer, temaer).then(() => {
            hentPlanIgjen();
        });
    }

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
                        value={redigertTemaliste.map((tema) =>
                            tema.planlagt ? tema.id : null,
                        )}
                        onChange={(val: number[]) => velgTema(val)}
                    >
                        {redigertTemaliste.map((tema) => (
                            <div key={tema.id}>
                                <Checkbox value={tema.id}>{tema.navn}</Checkbox>
                                {tema.planlagt && (
                                    <UndertemaSetupContainer>
                                        <UndertemaSetup
                                            valgteUndertemaer={tema.undertemaer}
                                            velgUndertemaer={(
                                                val: PlanUndertema[],
                                            ) => velgUndertema(tema.id, val)}
                                        />
                                    </UndertemaSetupContainer>
                                )}
                            </div>
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
                                lagreEndring();
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

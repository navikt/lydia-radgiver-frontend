import React from "react";
import { Button, Checkbox, CheckboxGroup, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import {
    PlanMal,
    PlanMalRequest,
    RedigertInnholdMal,
} from "../../../domenetyper/plan";
import { PlusIcon } from "@navikt/aksel-icons";
import TemaInnholdVelger from "./TemaInnholdVelger";
import {
    nyPlanPåSak,
    useHentPlan,
    useHentSamarbeid,
} from "../../../api/lydia-api";
import { isoDato } from "../../../util/dato";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const TemaInnholdVelgerContainer = styled.div`
    margin-bottom: 1rem;
    padding: 1rem;
    margin-left: 2rem;
    background-color: var(--a-surface-subtle);
    border-radius: var(--a-border-radius-medium);
`;

const OpprettPlanModal = styled(Modal)`
    max-width: 72rem;
`;

export default function OpprettPlanKnapp({
    saksnummer,
    orgnummer,
    samarbeid,
    brukerErEierAvSak,
    sakErIRettStatus,
    planMal,
}: {
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    brukerErEierAvSak: boolean;
    sakErIRettStatus: boolean;
    planMal: PlanMal;
}) {
    const { mutate: hentPlanIgjen } = useHentPlan(
        orgnummer,
        saksnummer,
        samarbeid.id,
    );
    const { mutate: hentSamarbeidPåNytt } = useHentSamarbeid(
        orgnummer,
        saksnummer,
    );
    const [modalOpen, setModalOpen] = React.useState(false);

    const [redigertPlanMal, setRedigertPlanMal] =
        React.useState<PlanMal>(planMal);

    function velgTema(valgteTemaIder: number[]) {
        setRedigertPlanMal({
            tema: redigertPlanMal.tema.map((tema) =>
                valgteTemaIder.includes(tema.rekkefølge)
                    ? { ...tema, planlagt: true }
                    : {
                          ...tema,
                          planlagt: false,
                          innhold: tema.innhold.map((innhold) => {
                              return {
                                  ...innhold,
                                  planlagt: false,
                                  startDato: null,
                                  sluttDato: null,
                              };
                          }),
                      },
            ),
        });
    }

    function velgUndertema(
        temaId: number,
        redigerteInnholdMal: RedigertInnholdMal[],
    ) {
        setRedigertPlanMal({
            tema: redigertPlanMal.tema.map((tema) =>
                tema.rekkefølge === temaId
                    ? {
                          ...tema,
                          innhold: redigerteInnholdMal,
                      }
                    : { ...tema },
            ),
        });
    }

    function lagreEndring() {
        const nyPlan = lagRequest(redigertPlanMal);
        nyPlanPåSak(orgnummer, saksnummer, samarbeid.id, nyPlan).then(() => {
            hentPlanIgjen();
            hentSamarbeidPåNytt();
        });
    }

    function lagRequest(plan: PlanMal): PlanMalRequest {
        return {
            tema: plan.tema.map((tema) => {
                return {
                    ...tema,
                    innhold: tema.innhold.map((innhold) => {
                        return {
                            ...innhold,
                            startDato:
                                innhold.startDato === null
                                    ? null
                                    : isoDato(innhold.startDato),
                            sluttDato:
                                innhold.sluttDato === null
                                    ? null
                                    : isoDato(innhold.sluttDato),
                        };
                    }),
                };
            }),
        };
    }

    return (
        <>
            <Button
                size="medium"
                iconPosition="left"
                variant="primary"
                icon={<PlusIcon />}
                style={{ margin: "1rem", minWidth: "10.5rem" }}
                onClick={() => setModalOpen(true)}
                disabled={!(brukerErEierAvSak && sakErIRettStatus)}
            >
                Opprett plan
            </Button>
            <OpprettPlanModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-label="Opprett plan"
            >
                <Modal.Body>
                    <CheckboxGroup
                        legend="Sett opp samarbeidsplan"
                        value={redigertPlanMal.tema.map((tema) =>
                            tema.planlagt ? tema.rekkefølge : null,
                        )}
                        onChange={(val: number[]) => velgTema(val)}
                    >
                        {redigertPlanMal.tema.map((tema) => (
                            <div key={tema.rekkefølge}>
                                <Checkbox value={tema.rekkefølge}>
                                    {tema.navn}
                                </Checkbox>
                                {tema.planlagt && (
                                    <TemaInnholdVelgerContainer>
                                        <TemaInnholdVelger
                                            valgteUndertemaer={tema.innhold}
                                            velgUndertemaer={(
                                                val: RedigertInnholdMal[],
                                            ) =>
                                                velgUndertema(
                                                    tema.rekkefølge,
                                                    val,
                                                )
                                            }
                                        />
                                    </TemaInnholdVelgerContainer>
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
            </OpprettPlanModal>
        </>
    );
}

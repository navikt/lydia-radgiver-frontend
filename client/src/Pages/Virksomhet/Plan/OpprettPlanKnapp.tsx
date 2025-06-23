import React, { useState } from "react";
import { Alert, Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import {
    PlanMal,
    PlanMalRequest,
    RedigertInnholdMal,
} from "../../../domenetyper/plan";
import { PlusIcon } from "@navikt/aksel-icons";
import TemaInnholdVelger from "./TemaInnholdVelger";
import { nyPlanPåSak, useHentPlan } from "../../../api/lydia-api/plan";
import { isoDato } from "../../../util/dato";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { loggModalÅpnet } from "../../../util/amplitude-klient";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";

const DuMåVelgeMinstEttTemaAlert = styled(Alert)`
    justify-content: end;
`;

const OpprettPlanModal = styled(Modal)`
    max-width: 72rem;
`;

export default function OpprettPlanKnapp({
    saksnummer,
    orgnummer,
    samarbeid,
    kanEndrePlan,
    sakErIRettStatus,
    planMal,
}: {
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    kanEndrePlan: boolean;
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

    function velgUndertema(
        temaId: number,
        redigerteInnholdMal: RedigertInnholdMal[],
    ) {
        const nyeTema = redigertPlanMal.tema.map((tema) =>
            tema.rekkefølge === temaId
                ? {
                      ...tema,
                      inkludert: redigerteInnholdMal.some(
                          ({ inkludert }) => inkludert,
                      ),
                      innhold: redigerteInnholdMal,
                  }
                : { ...tema },
        );
        setRedigertPlanMal({
            tema: nyeTema,
        });

        if (
            visTemaFeil &&
            redigerteInnholdMal.some(({ inkludert }) => inkludert)
        ) {
            setVisTemaFeil(false);
        }
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

    const [visTemaFeil, setVisTemaFeil] = useState<boolean>(false);
    const [visInnholdFeil, setVisInnholdFeil] = useState<boolean>(false);

    function håndterLagre() {
        if (!planErGyldig()) {
            return;
        }

        const nyPlan = lagRequest(redigertPlanMal);

        nyPlanPåSak(orgnummer, saksnummer, samarbeid.id, nyPlan).then(() => {
            hentPlanIgjen();
            hentSamarbeidPåNytt();
        });

        setModalOpen(false);
    }

    function planErGyldig(): boolean {
        const minstEttTemaValgt = redigertPlanMal.tema.some(
            (tema) => tema.inkludert,
        );
        const minstEttInnholdForValgtTemaValgt = redigertPlanMal.tema.every(
            (tema) =>
                (tema.inkludert &&
                    tema.innhold.some((innhold) => innhold.inkludert)) ||
                !tema.inkludert,
        );

        if (!minstEttTemaValgt) {
            setVisTemaFeil(true);
            return false;
        }

        if (!minstEttInnholdForValgtTemaValgt) {
            setVisInnholdFeil(true);
            return false;
        }
        return true;
    }

    return (
        <>
            <Button
                size="medium"
                iconPosition="left"
                variant="primary"
                icon={<PlusIcon />}
                style={{ margin: "1rem 1rem 1rem 0", minWidth: "10.5rem" }}
                onClick={() => {
                    loggModalÅpnet("Opprett plan");
                    setModalOpen(true);
                }}
                disabled={!(kanEndrePlan && sakErIRettStatus)}
            >
                Opprett plan
            </Button>
            <OpprettPlanModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-label="Opprett plan"
                header={{ heading: "Sett opp samarbeidsplan" }}
            >
                <Modal.Body>
                    {redigertPlanMal.tema.map((tema) => (
                        <div key={tema.rekkefølge}>
                            <TemaInnholdVelger
                                setVisInnholdFeil={setVisInnholdFeil}
                                temaNavn={tema.navn}
                                visInnholdFeil={visInnholdFeil}
                                valgteUndertemaer={tema.innhold}
                                velgUndertemaer={(val: RedigertInnholdMal[]) =>
                                    velgUndertema(tema.rekkefølge, val)
                                }
                            />
                        </div>
                    ))}
                    <br />
                    {visTemaFeil && (
                        <DuMåVelgeMinstEttTemaAlert inline variant="error">
                            Du må velge minst ett tema.
                        </DuMåVelgeMinstEttTemaAlert>
                    )}
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
                            disabled={visTemaFeil}
                            onClick={() => {
                                håndterLagre();
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

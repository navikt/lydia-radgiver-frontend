import React from "react";
import { Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import styled from "styled-components";
import { mobileAndUp } from "../../../styling/breakpoints";
import { DocPencilIcon } from "@navikt/aksel-icons";
import InnholdOppsett from "./InnholdOppsett";
import { Plan, PlanInnhold, PlanTema } from "../../../domenetyper/plan";
import { endrePlan, endrePlanTema } from "../../../api/lydia-api/plan";
import { lagRequest, TemaRequest, UndertemaRequest } from "./Requests";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { loggModalÅpnet } from "../../../util/amplitude-klient";

const EditTemaModal = styled(Modal)`
    padding: 0;
    max-width: 64rem;
    --a-spacing-6: 0.5rem;

    ${mobileAndUp} {
        padding: 1.5rem;
        --a-spacing-6: var(
            --a-spacing-6
        ); //TODO: Sette til originalverdien frå designsystemet
        // Vi prøver å hente ut originalverdien frå designsystemet
    }
`;

const EditTemaModalBody = styled(Modal.Body)`
    overflow: visible;
`;

export default function EditTemaKnapp({
    tema,
    orgnummer,
    saksnummer,
    samarbeid,
    hentPlanIgjen,
    samarbeidsplan,
}: {
    tema: PlanTema;
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    hentPlanIgjen: KeyedMutator<Plan>;
    samarbeidsplan: Plan;
}) {
    const [modalOpen, setModalOpen] = React.useState(false);

    const [redigertTema, setRedigertTema] = React.useState<PlanTema>(tema);

    React.useEffect(() => {
        setRedigertTema(tema);
    }, [tema]);

    const lagreEndring = () => {
        if (redigertTema.undertemaer.filter(({ inkludert }) => inkludert).length > 0) {
            const undertemaer: UndertemaRequest[] = lagRequest(
                redigertTema.undertemaer,
            );
            endrePlanTema(
                orgnummer,
                saksnummer,
                samarbeid.id,
                tema.id,
                undertemaer,
            ).then(() => {
                hentPlanIgjen();
            });
        } else {
            const temaer: TemaRequest[] = samarbeidsplan.temaer.map((t) =>
                t.id === tema.id
                    ? {
                        id: t.id,
                        inkludert: false,
                        undertemaer: lagRequest(redigertTema.undertemaer),
                    }
                    : {
                        id: t.id,
                        inkludert: t.inkludert,
                        undertemaer: lagRequest(t.undertemaer),
                    },
            );

            endrePlan(
                orgnummer,
                saksnummer,
                samarbeid.id,
                temaer,
            ).then(() => {
                hentPlanIgjen();
            });
        }
    };

    const harNoenValgteUndertema = redigertTema.undertemaer.some(
        (undertema) => undertema.inkludert,
    );

    return (
        <>
            <Button
                variant="tertiary"
                onClick={() => {
                    loggModalÅpnet("Rediger tema");
                    setModalOpen(true);
                }}
                icon={<DocPencilIcon aria-hidden />}
            >
                Rediger tema
            </Button>
            <EditTemaModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-label="Rediger tema"
            >
                {modalOpen && (
                    <EditTemaModalBody>
                        <InnholdOppsett
                            temaNavn={redigertTema.navn}
                            valgteInnhold={redigertTema.undertemaer}
                            velgInnhold={(
                                redigerteUndertemaer: PlanInnhold[],
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
                                    setRedigertTema(tema);
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
                                variant={harNoenValgteUndertema ? "primary" : "danger"}
                            >
                                {harNoenValgteUndertema ? "Lagre" : "Slett"}
                            </Button>
                        </ModalKnapper>
                    </EditTemaModalBody>
                )}
            </EditTemaModal>
        </>
    );
}

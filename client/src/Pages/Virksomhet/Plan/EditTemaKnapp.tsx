import { DocPencilIcon } from "@navikt/aksel-icons";
import { Button, Modal } from "@navikt/ds-react";
import React from "react";
import { KeyedMutator } from "swr";
import { endrePlanNyFlyt, endrePlanTemaNyFlyt } from "@/api/lydia-api/nyFlyt";
import { ModalKnapper } from "@/components/Modal/ModalKnapper";
import { IaSakProsess } from "@/domenetyper/iaSakProsess";
import { Plan, PlanInnhold, PlanTema } from "@/domenetyper/plan";
import { loggModalÅpnet } from "@/util/analytics-klient";
import InnholdOppsett from "./InnholdOppsett";
import styles from "./plan.module.scss";
import { lagRequest, TemaRequest, UndertemaRequest } from "./Requests";

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
        if (
            redigertTema.undertemaer.filter(({ inkludert }) => inkludert)
                .length > 0
        ) {
            const undertemaer: UndertemaRequest[] = lagRequest(
                redigertTema.undertemaer,
            );
            endrePlanTemaNyFlyt(
                orgnummer,
                saksnummer,
                samarbeid.id,
                samarbeidsplan.id,
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

            endrePlanNyFlyt(
                orgnummer,
                saksnummer,
                samarbeid.id,
                samarbeidsplan.id,
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
            <Modal
                className={styles.editTemaModal}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-label="Rediger tema"
            >
                {modalOpen && (
                    <Modal.Body className={styles.editTemaModalBody}>
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
                                variant={
                                    harNoenValgteUndertema
                                        ? "primary"
                                        : "danger"
                                }
                            >
                                {harNoenValgteUndertema ? "Lagre" : "Slett"}
                            </Button>
                        </ModalKnapper>
                    </Modal.Body>
                )}
            </Modal>
        </>
    );
}

import React, { useEffect } from "react";
import { BodyShort, Button, Modal } from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import InnholdOppsett from "./InnholdOppsett";
import { Plan, PlanInnhold, PlanTema } from "../../../domenetyper/plan";
import { endrePlan, slettPlan } from "../../../api/lydia-api/plan";
import { lagRequest, TemaRequest } from "./Requests";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { NotePencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { loggModalÅpnet } from "../../../util/amplitude-klient";

import styles from './plan.module.scss';
import { useHentBrukerinformasjon } from "../../../api/lydia-api/bruker";

export default function LeggTilTemaKnapp({
    saksnummer,
    orgnummer,
    samarbeid,
    samarbeidsplan,
    hentPlanIgjen,
    kanEndrePlan,
    sakErIRettStatus,
}: {
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    samarbeidsplan: Plan;
    hentPlanIgjen: KeyedMutator<Plan>;
    kanEndrePlan: boolean;
    sakErIRettStatus: boolean;
}) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const { data: brukerInformasjon } = useHentBrukerinformasjon();

    const [redigertTemaliste, setRedigertTemaliste] = React.useState<
        PlanTema[]
    >(samarbeidsplan.temaer);
    // Trengs for å se etter endringer i temalisten fra backend.
    const [gammelTemaliste, setGammelTemaliste] = React.useState<PlanTema[]>(
        samarbeidsplan.temaer,
    );

    useEffect(() => {
        // Hvis innholdet faktisk har endret seg.
        if (
            JSON.stringify(gammelTemaliste) !==
            JSON.stringify(samarbeidsplan.temaer)
        ) {
            setGammelTemaliste(samarbeidsplan.temaer);
            setRedigertTemaliste(samarbeidsplan.temaer);
        }
    }, [samarbeidsplan, gammelTemaliste]);

    function velgUndertema(
        temaId: number,
        redigerteUndertemaer: PlanInnhold[],
    ) {
        setRedigertTemaliste(
            redigertTemaliste.map((tema) =>
                tema.id === temaId
                    ? {
                        ...tema,
                        inkludert: redigerteUndertemaer.some(
                            ({ inkludert }) => inkludert,
                        ),
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
                inkludert: tema.inkludert,
                undertemaer: lagRequest(tema.undertemaer),
            };
        });

        endrePlan(orgnummer, saksnummer, samarbeid.id, temaer).then(() => {
            hentPlanIgjen();
        });
    }

    if (brukerInformasjon?.rolle === "Lesetilgang") {
        return null;
    }

    return (
        <>
            {!kanEndrePlan && (
                <>
                    <BodyShort>
                        Du må være eier eller følger av saken for å kunne gjøre
                        endringer
                    </BodyShort>
                    <br />
                </>
            )}
            {!sakErIRettStatus && (
                <>
                    <BodyShort>
                        Status må være i <i>Kartlegges</i> eller{" "}
                        <i>Vi bistår</i> for å kunne gjøre endringer
                    </BodyShort>
                    <br />
                </>
            )}
            <Button
                size="medium"
                iconPosition="left"
                variant="primary"
                icon={<NotePencilIcon aria-hidden />}
                style={{ margin: "1rem", minWidth: "10.5rem" }}
                onClick={() => {
                    loggModalÅpnet("Rediger plan");
                    setModalOpen(true);
                }}
                disabled={!(kanEndrePlan && sakErIRettStatus)}
            >
                Rediger plan
            </Button>
            <Modal
                className={styles.leggTilTemaModal}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-label="Legg til tema"
                header={{ heading: "Sett opp samarbeidsplan" }}
            >
                <Modal.Body style={{ overflowY: "auto" }}>
                    <BodyShort className={styles.subheading}>Velg innhold og varighet</BodyShort>
                    {modalOpen &&
                        redigertTemaliste
                            .sort((a, b) => {
                                return a.id - b.id;
                            })
                            .map((tema) => (
                                <InnholdOppsett
                                    key={tema.id}
                                    temaNavn={tema.navn}
                                    valgteInnhold={tema.undertemaer}
                                    velgInnhold={(val: PlanInnhold[]) =>
                                        velgUndertema(tema.id, val)
                                    }
                                />
                            ))}
                    <br />
                    <ActionButtons
                        setModalOpen={setModalOpen}
                        lagreEndring={lagreEndring}
                        setRedigertTemaliste={setRedigertTemaliste}
                        samarbeidsplan={samarbeidsplan}
                        slettPlan={() =>
                            slettPlan(orgnummer, saksnummer, samarbeid.id).then(
                                hentPlanIgjen,
                            )
                        }
                        redigertTemaliste={redigertTemaliste}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}

function ActionButtons({
    setModalOpen,
    lagreEndring,
    slettPlan,
    redigertTemaliste,
    setRedigertTemaliste,
    samarbeidsplan,
}: {
    setModalOpen: (åpen: boolean) => void;
    lagreEndring: () => void;
    slettPlan: () => void;
    redigertTemaliste: PlanTema[];
    setRedigertTemaliste: (temaliste: PlanTema[]) => void;
    samarbeidsplan: Plan;
}) {
    const harTemaUtenUndertema = React.useMemo(
        () =>
            redigertTemaliste.some(
                (tema) =>
                    tema.inkludert &&
                    !tema.undertemaer.some((undertema) => undertema.inkludert),
            ),
        [redigertTemaliste],
    );
    const planErTom = React.useMemo(
        () => !redigertTemaliste.some(({ inkludert }) => inkludert),
        [redigertTemaliste],
    );

    if (planErTom) {
        return (
            <ModalKnapper>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setRedigertTemaliste(samarbeidsplan.temaer);
                        setModalOpen(false);
                    }}
                >
                    Avbryt
                </Button>
                <Button
                    onClick={() => {
                        slettPlan();
                        setModalOpen(false);
                    }}
                    icon={<TrashIcon aria-hidden />}
                    variant="primary"
                >
                    Slett plan
                </Button>
            </ModalKnapper>
        );
    }
    return (
        <ModalKnapper>
            <Button
                variant="secondary"
                onClick={() => {
                    setRedigertTemaliste(samarbeidsplan.temaer);
                    setModalOpen(false);
                }}
            >
                Avbryt
            </Button>
            <Button
                disabled={harTemaUtenUndertema}
                onClick={() => {
                    lagreEndring();
                    setModalOpen(false);
                }}
            >
                Lagre
            </Button>
        </ModalKnapper>
    );
}

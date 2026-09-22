import React, { useEffect } from "react";
import { BodyShort, Button, LocalAlert, Modal } from "@navikt/ds-react";
import InnholdOppsett from "../InnholdOppsett";
import { Plan, PlanInnhold, PlanTema } from "../../../../domenetyper/plan";
import {
    endrePlanNyFlyt,
    slettSamarbeidsplanNyFlyt,
} from "../../../../api/lydia-api/nyFlyt";
import { lagRequest, TemaRequest } from "../Requests";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { NotePencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { loggModalÅpnet } from "../../../../util/analytics-klient";
import { useHentBrukerinformasjon } from "../../../../api/lydia-api/bruker";

import styles from "../plan.module.scss";

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

    const planErTom = React.useMemo(
        () => redigertTemaliste.every(({ inkludert }) => !inkludert),
        [redigertTemaliste],
    );
    const planErPublisert = samarbeidsplan.publiseringStatus === "PUBLISERT";

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

    if (brukerInformasjon?.rolle === "Lesetilgang") {
        return null;
    }

    return (
        <>
            {!kanEndrePlan && (
                <>
                    <BodyShort>
                        Du må være eier eller følger for å kunne gjøre endringer
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
                    <BodyShort className={styles.subheading}>
                        Velg innhold og varighet
                    </BodyShort>
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
                    {planErTom && planErPublisert && <PlanKanIkkeSlettesInfo />}
                </Modal.Body>
                <ActionButtons
                    setModalOpen={setModalOpen}
                    lagreEndring={lagreEndring}
                    setRedigertTemaliste={setRedigertTemaliste}
                    samarbeidsplan={samarbeidsplan}
                    redigertTemaliste={redigertTemaliste}
                    slettPlan={() => {
                        slettSamarbeidsplanNyFlyt(
                            orgnummer,
                            saksnummer,
                            samarbeid.id,
                            samarbeidsplan.id,
                        ).then(() => hentPlanIgjen(undefined));
                    }}
                    planErTom={planErTom}
                    kanSlette={!planErPublisert}
                />
            </Modal>
        </>
    );
}

function PlanKanIkkeSlettesInfo() {
    const [alertLukket, setAlertLukket] = React.useState(false);

    const ref = React.useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const foretrekkerRedusertBevegelse = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        ref.current?.scrollIntoView({
            behavior: foretrekkerRedusertBevegelse ? "auto" : "smooth",
        });
    }, []);

    return (
        !alertLukket && (
            <LocalAlert status="announcement" ref={ref}>
                <LocalAlert.Header>
                    <LocalAlert.Title>Planen kan ikke slettes</LocalAlert.Title>
                    <LocalAlert.CloseButton
                        onClick={() => setAlertLukket(true)}
                    />
                </LocalAlert.Header>
                <LocalAlert.Content>
                    Planen er publisert og kan derfor ikke slettes. Om
                    samarbeidet ikke skal fortsette, kan du avbryte det.
                </LocalAlert.Content>
            </LocalAlert>
        )
    );
}

function ActionButtons({
    setModalOpen,
    lagreEndring,
    slettPlan,
    redigertTemaliste,
    setRedigertTemaliste,
    samarbeidsplan,
    planErTom,
    kanSlette,
}: {
    setModalOpen: (åpen: boolean) => void;
    lagreEndring: () => void;
    slettPlan: () => void;
    redigertTemaliste: PlanTema[];
    setRedigertTemaliste: (temaliste: PlanTema[]) => void;
    samarbeidsplan: Plan;
    planErTom: boolean;
    kanSlette: boolean;
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

    if (planErTom) {
        return (
            <Modal.Footer>
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
                    disabled={!kanSlette}
                    icon={<TrashIcon aria-hidden />}
                    variant="primary"
                >
                    Slett plan
                </Button>
            </Modal.Footer>
        );
    }
    return (
        <Modal.Footer>
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
        </Modal.Footer>
    );
}

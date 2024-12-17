import React, { useEffect } from "react";
import {
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    Modal,
} from "@navikt/ds-react";
import { ModalKnapper } from "../../../components/Modal/ModalKnapper";
import InnholdOppsett from "./InnholdOppsett";
import styled from "styled-components";
import { Plan, PlanInnhold, PlanTema } from "../../../domenetyper/plan";
import { endrePlan } from "../../../api/lydia-api/plan";
import { lagRequest, TemaRequest } from "./Requests";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { NotePencilIcon } from "@navikt/aksel-icons";
import { loggModalÅpnet } from "../../../util/amplitude-klient";

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
    samarbeid,
    samarbeidsplan,
    hentPlanIgjen,
    brukerErEierAvSak,
    sakErIRettStatus,
}: {
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    samarbeidsplan: Plan;
    hentPlanIgjen: KeyedMutator<Plan>;
    brukerErEierAvSak: boolean;
    sakErIRettStatus: boolean;
}) {
    const [modalOpen, setModalOpen] = React.useState(false);

    const [redigertTemaliste, setRedigertTemaliste] = React.useState<
        PlanTema[]
    >(samarbeidsplan.temaer);
    // Trengs for å se etter endringer i temalisten fra backend.
    const [gammelTemaliste, setGammelTemaliste] = React.useState<
        PlanTema[]
    >(samarbeidsplan.temaer);

    const harTemaUtenUndertema = React.useMemo(() => redigertTemaliste.some((tema) => tema.inkludert && !tema.undertemaer.some((undertema) => undertema.inkludert)), [redigertTemaliste]);

    useEffect(() => {
        // Hvis innholdet faktisk har endret seg.
        if (JSON.stringify(gammelTemaliste) !== JSON.stringify(samarbeidsplan.temaer)) {
            setGammelTemaliste(samarbeidsplan.temaer);
            setRedigertTemaliste(samarbeidsplan.temaer);
        }
    }, [samarbeidsplan, gammelTemaliste]);

    function velgTema(valgteTemaIder: number[]) {
        setRedigertTemaliste(
            redigertTemaliste
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((tema) =>
                    valgteTemaIder.includes(tema.id)
                        ? {
                            ...tema,
                            inkludert: true,
                            undertemaer: tema.inkludert ? tema.undertemaer : samarbeidsplan.temaer.find((t) => t.id === tema.id)?.undertemaer ?? [],
                        }
                        : {
                            ...tema,
                            inkludert: false,
                            undertemaer: tema.undertemaer.map((undertema) => {
                                return {
                                    ...undertema,
                                    inkludert: false,
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
        redigerteUndertemaer: PlanInnhold[],
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
                inkludert: tema.inkludert,
                undertemaer: lagRequest(tema.undertemaer),
            };
        });

        endrePlan(orgnummer, saksnummer, samarbeid.id, temaer).then(() => {
            hentPlanIgjen();
        });
    }

    return (
        <>
            {!brukerErEierAvSak && (
                <>
                    <BodyShort>
                        Du må være eier av saken for å kunne gjøre endringer
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
                disabled={!(brukerErEierAvSak && sakErIRettStatus)}
            >
                Rediger plan
            </Button>
            <LeggTilTemaModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-label="Legg til tema"
            >
                <Modal.Body>
                    <CheckboxGroup
                        legend="Sett opp samarbeidsplan"
                        value={redigertTemaliste.map((tema) =>
                            tema.inkludert ? tema.id : null,
                        )}
                        onChange={(val: number[]) => velgTema(val)}
                    >
                        {modalOpen &&
                            redigertTemaliste
                                .sort((a, b) => {
                                    return a.id - b.id;
                                })
                                .map((tema) => (
                                    <div key={tema.id}>
                                        <Checkbox value={tema.id}>
                                            {tema.navn}
                                        </Checkbox>
                                        {tema.inkludert && (
                                            <UndertemaSetupContainer>
                                                <InnholdOppsett
                                                    temaNavn={tema.navn}
                                                    valgteInnhold={
                                                        tema.undertemaer
                                                    }
                                                    velgInnhold={(
                                                        val: PlanInnhold[],
                                                    ) =>
                                                        velgUndertema(
                                                            tema.id,
                                                            val,
                                                        )
                                                    }
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
                            disabled={harTemaUtenUndertema}
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

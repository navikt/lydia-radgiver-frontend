import { Accordion, Alert, BodyLong, Select } from "@navikt/ds-react";
import React from "react";
import {
    Plan,
    PlanInnhold,
    PlanInnholdStatus,
    PlanTema,
} from "../../../domenetyper/plan";
import { endrePlanStatus } from "../../../api/lydia-api/plan";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { lokalDatoMedKortTekstmåned } from "../../../util/dato";
import { samarbeidErFullført } from "../Samarbeid/SamarbeidContext";
import capitalizeFirstLetterLowercaseRest from "../../../util/formatering/capitalizeFirstLetterLowercaseRest";

import styles from './innholdsBlokk.module.scss';

export default function InnholdsBlokk({
    saksnummer,
    orgnummer,
    samarbeid,
    tema,
    hentPlanIgjen,
    kanOppretteEllerEndrePlan,
}: {
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    tema: PlanTema;
    hentPlanIgjen: KeyedMutator<Plan>;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return (
        <Accordion className={styles.innholdsblokk}>
            <div className={styles.labelRad}>
                <span className={styles.innholdLabel}>Innhold</span>
                <span className={styles.varighetLabel}>Varighet</span>
                <span className={styles.statusLabel}>Status</span>
            </div>
            {tema.undertemaer
                .filter((undertema) => undertema.inkludert)
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((undertema) => (
                    <InnholdsRad
                        key={undertema.id}
                        innhold={undertema}
                        kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
                        oppdaterStatus={(status: PlanInnholdStatus) =>
                            endrePlanStatus(
                                orgnummer,
                                saksnummer,
                                samarbeid.id,
                                tema.id,
                                undertema.id,
                                status,
                            ).then(() => {
                                hentPlanIgjen();
                            })
                        }
                    />
                ))}
        </Accordion>
    );
}

function InnholdsRad({
    innhold,
    oppdaterStatus,
    kanOppretteEllerEndrePlan,
}: {
    innhold: PlanInnhold;
    oppdaterStatus: (status: PlanInnholdStatus) => void;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return (
        <Accordion.Item className={styles.innholdRad}>
            <InnholdsRadHeader
                innhold={innhold}
                oppdaterStatus={oppdaterStatus}
                kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
            />
            <Accordion.Content className={styles.målContainer}>
                <BodyLong>
                    <b>Mål: </b>
                    {innhold.målsetning}
                </BodyLong>
            </Accordion.Content>
        </Accordion.Item>
    );
}

function InnholdsRadHeader({
    innhold,
    oppdaterStatus,
    kanOppretteEllerEndrePlan,
}: {
    innhold: PlanInnhold;
    oppdaterStatus: (status: PlanInnholdStatus) => void;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return (
        <>
            <Accordion.Header className={styles.innholdsradheader}>
                <span className={styles.innholdstittel}>{innhold.navn}</span>
                <InnholdsVarighetHeader
                    start={innhold.startDato}
                    slutt={innhold.sluttDato}
                />
            </Accordion.Header>
            <div className={styles.statusSelectContainer}>
                <InnholdsStatusHeader
                    innhold={innhold}
                    oppdaterStatus={oppdaterStatus}
                    kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
                />
            </div>
        </>
    );
}

function InnholdsVarighetHeader({
    start,
    slutt,
}: {
    start: Date | null;
    slutt: Date | null;
}) {
    return (
        <>
            {start && <PrettyInnholdsDato date={start} />} -{" "}
            {slutt && <PrettyInnholdsDato date={slutt} />}
        </>
    );
}

export function PrettyInnholdsDato({
    date,
    visNesteMåned = false,
}: {
    date: Date;
    visNesteMåned?: boolean;
}) {
    return React.useMemo(() => {
        const nyDato = new Date(date);
        if (visNesteMåned) {
            nyDato.setDate(nyDato.getDate() - 1);
        }

        return lokalDatoMedKortTekstmåned(nyDato);
    }, [visNesteMåned, date]);
}

function InnholdsStatusHeader({
    oppdaterStatus,
    kanOppretteEllerEndrePlan,
    innhold,
}: {
    oppdaterStatus: (status: PlanInnholdStatus) => void;
    kanOppretteEllerEndrePlan: boolean;
    innhold: PlanInnhold;
}) {
    if (samarbeidErFullført()) {
        return <span className={styles.ikkeredigerbarStatus}>{innhold.status ? capitalizeFirstLetterLowercaseRest(innhold.status) : "Malgler status"}</span>
    }

    return innhold.status ? (
        <span>
            <Select
                label={`Status for ${innhold.navn}`}
                size="small"
                hideLabel
                value={innhold.status}
                disabled={!kanOppretteEllerEndrePlan}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                    oppdaterStatus(e.target.value as PlanInnholdStatus);
                    e.stopPropagation();
                }}
            >
                <option value="FULLFØRT">Fullført</option>
                <option value="PÅGÅR">Pågår</option>
                <option value="PLANLAGT">Planlagt</option>
                <option value="AVBRUTT">Avbrutt</option>
            </Select>
        </span>
    ) : (
        <Alert variant={"error"}>STATUS MANGLER</Alert>
    );
}

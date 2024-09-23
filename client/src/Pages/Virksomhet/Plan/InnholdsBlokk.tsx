import { Accordion, Alert, BodyLong, Select } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import {
    Plan,
    PlanInnhold,
    PlanInnholdStatus,
    PlanTema,
} from "../../../domenetyper/plan";
import { endrePlanStatus } from "../../../api/lydia-api";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const StyledAccordion = styled(Accordion)`
    width: 100%;
    display: grid;
    grid-template-columns: min-content 1fr 1fr 8rem;
`;
const StyledAccordionItem = styled(Accordion.Item)`
    grid-column: 1/5;
    display: grid;
    grid-template-columns: subgrid;
`;
const StyledAccordionHeader = styled(Accordion.Header)`
    grid-column: 1/5;
    display: grid;
    grid-template-columns: subgrid;
    .navds-accordion__header-content {
        grid-column: 2/5;
        display: grid;
        grid-template-columns: subgrid;
    }
`;
const StyledAccordionContent = styled(Accordion.Content)`
    grid-column: 1/5;
`;

const LabelRad = styled.div`
    grid-column: 1/5;
    display: grid;
    grid-template-columns: subgrid;
    padding-bottom: 0.5rem;
    font-weight: 600;
`;

const InnholdLabel = styled.span`
    grid-column: 2/3;
`;
const VarighetLabel = styled.span`
    grid-column: 3/4;
`;
const StatusLabel = styled.span`
    grid-column: 4/5;
`;

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
        <StyledAccordion>
            <LabelRad>
                <InnholdLabel>Innhold</InnholdLabel>
                <VarighetLabel>Varighet</VarighetLabel>
                <StatusLabel>Status</StatusLabel>
            </LabelRad>
            {tema.undertemaer
                .filter((undertema) => undertema.planlagt)
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
        </StyledAccordion>
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
        <StyledAccordionItem>
            <InnholdsRadHeader
                innhold={innhold}
                oppdaterStatus={oppdaterStatus}
                kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
            />
            <StyledAccordionContent>
                <BodyLong>
                    <b>Mål: </b>
                    {innhold.målsetning}
                </BodyLong>
            </StyledAccordionContent>
        </StyledAccordionItem>
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
        <StyledAccordionHeader>
            <span>{innhold.navn}</span>
            <InnholdsVarighetHeader
                start={innhold.startDato}
                slutt={innhold.sluttDato}
            />
            <InnholdsStatusHeader
                status={innhold.status}
                oppdaterStatus={oppdaterStatus}
                kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
            />
        </StyledAccordionHeader>
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

        const nyDatoTekst = nyDato.toLocaleDateString("nb-NO", {
            month: "short",
            day: "numeric",
            year: "2-digit",
        });

        return nyDatoTekst[0].toUpperCase() + nyDatoTekst.substring(1);
    }, [visNesteMåned, date]);
}

function InnholdsStatusHeader({
    status,
    oppdaterStatus,
    kanOppretteEllerEndrePlan,
}: {
    status: PlanInnholdStatus | null;
    oppdaterStatus: (status: PlanInnholdStatus) => void;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return status ? (
        <span>
            <Select
                label="Status"
                size="small"
                hideLabel
                value={status}
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

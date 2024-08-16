import { Accordion, Alert, Heading, Select } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import {
    Plan,
    PlanStatus,
    PlanTema,
    PlanUndertema,
} from "../../../domenetyper/plan";
import { endrePlanStatus } from "../../../api/lydia-api";
import { KeyedMutator } from "swr";

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

const TemaLabel = styled.span`
    grid-column: 2/3;
`;
const PeriodeLabel = styled.span`
    grid-column: 3/4;
`;
const StatusLabel = styled.span`
    grid-column: 4/5;
`;

export default function UndertemaConfig({
    saksnummer,
    orgnummer,
    tema,
    hentPlanIgjen,
    kanOppretteEllerEndrePlan,
}: {
    orgnummer: string;
    saksnummer: string;
    tema: PlanTema;
    hentPlanIgjen: KeyedMutator<Plan>;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return (
        <StyledAccordion>
            <LabelRad>
                <TemaLabel>Tema</TemaLabel>
                <PeriodeLabel>Periode</PeriodeLabel>
                <StatusLabel>Status</StatusLabel>
            </LabelRad>
            {tema.undertemaer
                .filter((undertema) => undertema.planlagt)
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((undertema) => (
                    <Temalinje
                        key={undertema.id}
                        undertema={undertema}
                        kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
                        oppdaterStatus={(status: PlanStatus) =>
                            endrePlanStatus(
                                orgnummer,
                                saksnummer,
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

function Temalinje({
    undertema,
    oppdaterStatus,
    kanOppretteEllerEndrePlan,
}: {
    undertema: PlanUndertema;
    oppdaterStatus: (status: PlanStatus) => void;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return (
        <StyledAccordionItem>
            <TemalinjeHeader
                undertema={undertema}
                oppdaterStatus={oppdaterStatus}
                kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
            />
            <StyledAccordionContent>
                <Heading level="4" size="small">
                    Mål: {undertema.målsetning}
                </Heading>
            </StyledAccordionContent>
        </StyledAccordionItem>
    );
}

function TemalinjeHeader({
    undertema,
    oppdaterStatus,
    kanOppretteEllerEndrePlan,
}: {
    undertema: PlanUndertema;
    oppdaterStatus: (status: PlanStatus) => void;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return (
        <StyledAccordionHeader>
            <span>{undertema.navn}</span>
            <TemalinjeHeaderPeriode
                start={undertema.startDato}
                slutt={undertema.sluttDato}
            />
            <TemalinjeHeaderStatus
                status={undertema.status}
                oppdaterStatus={oppdaterStatus}
                kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
            />
        </StyledAccordionHeader>
    );
}

function TemalinjeHeaderPeriode({
    start,
    slutt,
}: {
    start: Date | null;
    slutt: Date | null;
}) {
    return (
        <>
            {start && <PrettyUndertemaDate date={start} />} -{" "}
            {slutt && <PrettyUndertemaDate date={slutt} />}
        </>
    );
}

export function PrettyUndertemaDate({
    date,
    visNesteMåned = false,
}: {
    date: Date;
    visNesteMåned?: boolean;
}) {
    const visningsdato = React.useMemo(() => {
        const nyDato = new Date(date);
        if (visNesteMåned) {
            nyDato.setDate(nyDato.getDate() - 1);
        }

        return nyDato;
    }, [visNesteMåned, date]);

    return `${visningsdato.toLocaleString("default", { month: "short" })} ${visningsdato.getFullYear()}`;
}

function TemalinjeHeaderStatus({
    status,
    oppdaterStatus,
    kanOppretteEllerEndrePlan,
}: {
    status: PlanStatus | null;
    oppdaterStatus: (status: PlanStatus) => void;
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
                    oppdaterStatus(e.target.value as PlanStatus);
                    e.stopPropagation();
                }}
            >
                <option value="FULLFØRT">Fullført</option>
                <option value="PÅGÅR">Pågår</option>
                <option value="PLANLAGT">Planlagt</option>
            </Select>
        </span>
    ) : (
        <Alert variant={"error"}>STATUS MANGLER</Alert>
    );
}

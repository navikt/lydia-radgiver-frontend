import { Accordion, Alert, BodyLong, Heading, Select } from "@navikt/ds-react";
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
}: {
    orgnummer: string;
    saksnummer: string;
    tema: PlanTema;
    hentPlanIgjen: KeyedMutator<Plan>;
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
                .map((undertema) => (
                    <Temalinje
                        key={undertema.id}
                        undertema={undertema}
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
}: {
    undertema: PlanUndertema;
    oppdaterStatus: (status: PlanStatus) => void;
}) {
    return (
        <StyledAccordionItem>
            <TemalinjeHeader
                undertema={undertema}
                oppdaterStatus={oppdaterStatus}
            />
            <StyledAccordionContent>
                <Heading level="4" size="small">
                    {undertema.målsetning}
                </Heading>
                <BodyLong>{undertema.beskrivelse}</BodyLong>
            </StyledAccordionContent>
        </StyledAccordionItem>
    );
}

function TemalinjeHeader({
    undertema,
    oppdaterStatus,
}: {
    undertema: PlanUndertema;
    oppdaterStatus: (status: PlanStatus) => void;
}) {
    return (
        <StyledAccordionHeader>
            <span>{undertema.navn}</span>
            <TemalinjeHeaderPeriode
                start={undertema.startDato ?? new Date()}
                slutt={undertema.sluttDato ?? new Date()}
            />
            <TemalinjeHeaderStatus
                status={undertema.status}
                oppdaterStatus={oppdaterStatus}
            />
        </StyledAccordionHeader>
    );
}

function TemalinjeHeaderPeriode({
    start,
    slutt,
}: {
    start: Date;
    slutt: Date;
}) {
    return (
        <>
            <PrettyDate date={start} /> - <PrettyDate date={slutt} />
        </>
    );
}

function PrettyDate({
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
}: {
    status: PlanStatus | null;
    oppdaterStatus: (status: PlanStatus) => void;
}) {
    return status ? (
        <span>
            <Select
                label="Status"
                size="small"
                hideLabel
                value={status}
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

import { Accordion, BodyLong, Heading, Select } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import { PlanStatus, PlanTema, PlanUndertema } from "../../../domenetyper/plan";

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

export default function UndertemaConfig({ tema }: { tema: PlanTema }) {
    return (
        <StyledAccordion>
            <LabelRad>
                <TemaLabel>Tema</TemaLabel>
                <PeriodeLabel>Periode</PeriodeLabel>
                <StatusLabel>Status</StatusLabel>
            </LabelRad>
            {tema.undertemaer
                .filter((undertema) => undertema.planlagt)
                .map((undertema, index) => (
                    <Temalinje key={index} undertema={undertema} />
                ))}
        </StyledAccordion>
    );
}

function Temalinje({ undertema }: { undertema: PlanUndertema }) {
    return (
        <StyledAccordionItem>
            <TemalinjeHeader undertema={undertema} />
            <StyledAccordionContent>
                <Heading level="4" size="small">
                    {undertema.målsetning}
                    {/*Mål: Øke kompetansen på hvordan gjennomføre gode*/}
                    {/*oppfølgingssamtaler, både gjennom teori og praksis.*/}
                </Heading>
                <BodyLong>
                    {undertema.beskrivelse}
                    {/*God dialog mellom leder og ansatt er sentralt i god*/}
                    {/*sykefraværsoppfølging. En oppfølgingssamtale er en godt*/}
                    {/*forberedt og personlig samtale mellom leder og medarbeider.*/}
                    {/*Det er lovvpålagt å lage oppfølgingsplan for alle*/}
                    {/*sykemeldte, følge opp og dokumentere samtaler.*/}
                </BodyLong>
            </StyledAccordionContent>
        </StyledAccordionItem>
    );
}

function TemalinjeHeader({ undertema }: { undertema: PlanUndertema }) {
    return (
        <StyledAccordionHeader>
            <span>{undertema.navn}</span>
            <TemalinjeHeaderPeriode
                start={undertema.startDato ?? new Date()}
                slutt={undertema.sluttDato ?? new Date()}
            />
            <TemalinjeHeaderStatus status={undertema.status} />
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

function TemalinjeHeaderStatus({ status }: { status: PlanStatus | null }) {
    return status ? (
        <span>
            <Select
                label="Status"
                size="small"
                hideLabel
                value={status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                    e.stopPropagation();
                }}
            >
                <option value="FULLFØRT">Fullført</option>
                <option value="PÅGÅR">Pågår</option>
                <option value="PLANLAGT">Planlagt</option>
            </Select>
        </span>
    ) : undefined;
}

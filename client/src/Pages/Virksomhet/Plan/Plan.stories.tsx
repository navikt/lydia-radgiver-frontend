import { Meta } from "@storybook/react";
import PlanGraf, { PølsegrafProps } from "./PlanGraf";
import { PlanUndertema } from "../../../domenetyper/plan";

export default {
    title: "Virksomhet/Plan",
    component: PlanGraf,
    parameters: {
        layout: "fullscreen",
    },
    args: {
        antallPølser: 4,
    },
    argTypes: {
        antallPølser: {
            control: {
                type: "number",
            },
        },
    },
} as Meta<typeof PlanGraf>;

const dummyPølser: PlanUndertema[] = [
    {
        id: 1,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2024, 0),
        sluttDato: new Date(2024, 3),
        navn: "Sykefraværsrutiner",
        status: "PÅGÅR",
    },
    {
        id: 2,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2024, 2),
        sluttDato: new Date(2024, 5),
        navn: "Oppfølgingssamtaler",
        status: "FULLFØRT",
    },
    {
        id: 3,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2024, 7),
        sluttDato: new Date(2024, 10),
        navn: "Tilretteleggings- og medvirkningsplikt",
        status: "PLANLAGT",
    },
    {
        id: 4,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2024, 7),
        sluttDato: new Date(2024, 9),
        navn: "Gjentagende sykefravær",
        status: "PÅGÅR",
    },
    {
        id: 5,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2024, 9),
        sluttDato: new Date(2024, 11),
        navn: "Enda en greie",
        status: "FULLFØRT",
    },
    {
        id: 6,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2025, 0),
        sluttDato: new Date(2025, 3),
        navn: "Sykefraværsrutiner 2",
        status: "PLANLAGT",
    },
    {
        id: 7,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2025, 2),
        sluttDato: new Date(2025, 5),
        navn: "Oppfølgingssamtaler 2",
        status: "PÅGÅR",
    },
    {
        id: 8,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2025, 7),
        sluttDato: new Date(2025, 10),
        navn: "Tilretteleggings- og medvirkningsplikt 2",
        status: "FULLFØRT",
    },
    {
        id: 9,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2025, 7),
        sluttDato: new Date(2025, 9),
        navn: "Gjentagende sykefravær 2",
        status: "PLANLAGT",
    },
    {
        id: 10,
        målsetning: "Vi har et mål",
        planlagt: true,
        startDato: new Date(2025, 9),
        sluttDato: new Date(2025, 11),
        navn: "Enda en greie 2",
        status: "FULLFØRT",
    },
];

export const PlanGrafStory = ({
    antallPølser,
}: PølsegrafProps & { antallPølser: number }) => (
    <div
        style={{
            backgroundColor: "white",
            padding: "2rem",
            margin: "2rem",
            border: "1px solid lightgray",
            borderRadius: "1rem",
        }}
    >
        <PlanGraf undertemaer={dummyPølser.slice(0, antallPølser)} />
    </div>
);

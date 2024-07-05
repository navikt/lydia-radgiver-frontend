import { Meta } from "@storybook/react";
import PlanGraf, { PølsegrafProps } from "./PlanGraf";
import { Arbeidsperiode } from "./UndertemaConfig";

export default {
    title: "Virksomhet/Plan",
    component: PlanGraf,
    parameters: {
        layout: 'fullscreen'
    },
    args: {
        antallPølser: 4,
    },
    argTypes: {
        antallPølser: {
            control: {
                type: 'number'
            }
        },
    }
} as Meta<typeof PlanGraf>;

const dummyPølser: Arbeidsperiode[] = [
    {
        start: new Date(2024, 0),
        slutt: new Date(2024, 3),
        tittel: 'Sykefraværsrutiner',
        status: "Pågår",
        statusfarge: "success"
    },
    {
        start: new Date(2024, 2),
        slutt: new Date(2024, 5),
        tittel: 'Oppfølgingssamtaler',
        status: "Fullført",
        statusfarge: "warning"
    },
    {
        start: new Date(2024, 7),
        slutt: new Date(2024, 10),
        tittel: 'Tilretteleggings- og medvirkningsplikt',
        status: "Planlagt",
        statusfarge: "danger"
    },
    {
        start: new Date(2024, 7),
        slutt: new Date(2024, 9),
        tittel: 'Gjentagende sykefravær',
        status: "Pågår",
        statusfarge: "info"
    },
    {
        start: new Date(2024, 9),
        slutt: new Date(2024, 11),
        tittel: 'Enda en greie',
        status: "Fullført",
        statusfarge: "neutral"
    },
    {
        start: new Date(2025, 0),
        slutt: new Date(2025, 3),
        tittel: 'Sykefraværsrutiner 2',
        status: "Planlagt",
        statusfarge: "success"
    },
    {
        start: new Date(2025, 2),
        slutt: new Date(2025, 5),
        tittel: 'Oppfølgingssamtaler 2',
        status: "Pågår",
        statusfarge: "warning"
    },
    {
        start: new Date(2025, 7),
        slutt: new Date(2025, 10),
        tittel: 'Tilretteleggings- og medvirkningsplikt 2',
        status: "Fullført",
        statusfarge: "danger"
    },
    {
        start: new Date(2025, 7),
        slutt: new Date(2025, 9),
        tittel: 'Gjentagende sykefravær 2',
        status: "Planlagt",
        statusfarge: "info"
    },
    {
        start: new Date(2025, 9),
        slutt: new Date(2025, 11),
        tittel: 'Enda en greie 2',
        status: "Fullført",
        statusfarge: "neutral"
    },
];

export const PlanGrafStory = ({ antallPølser }: PølsegrafProps & { antallPølser: number }) => (
    <div style={{ backgroundColor: "white", padding: "2rem", margin: "2rem", border: "1px solid lightgray", borderRadius: "1rem" }}>
        <PlanGraf
            pølser={dummyPølser.slice(0, antallPølser)}
        />
    </div>
)

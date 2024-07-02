import { Meta } from "@storybook/react";
import PlanGraf, { PølsegrafProps } from "./PlanGraf";

export default {
    title: "Virksomhet/Plan",
    component: PlanGraf,
    parameters: {
        layout: 'fullscreen'
    },
    args: {
        start: new Date(2024, 0),
        slutt: new Date(2025, 0),
        antallPølser: 4,
    },
    argTypes: {
        start: {
            control: {
                type: 'date'
            }
        },
        slutt: {
            control: {
                type: 'date'
            }
        },
        antallPølser: {
            control: {
                type: 'number'
            }
        },
    }
} as Meta<typeof PlanGraf>;

const dummyPølser = [
    {
        start: new Date(2024, 0),
        slutt: new Date(2024, 3),
        tittel: 'Sykefraværsrutiner',
    },
    {
        start: new Date(2024, 2),
        slutt: new Date(2024, 5),
        tittel: 'Oppfølgingssamtaler',
    },
    {
        start: new Date(2024, 7),
        slutt: new Date(2024, 10),
        tittel: 'Tilretteleggings- og medvirkningsplikt',
    },
    {
        start: new Date(2024, 7),
        slutt: new Date(2024, 9),
        tittel: 'Gjentagende sykefravær',
    },
    {
        start: new Date(2024, 9),
        slutt: new Date(2024, 11),
        tittel: 'Enda en greie',
    },
    {
        start: new Date(2025, 0),
        slutt: new Date(2025, 3),
        tittel: 'Sykefraværsrutiner 2',
    },
    {
        start: new Date(2025, 2),
        slutt: new Date(2025, 5),
        tittel: 'Oppfølgingssamtaler 2',
    },
    {
        start: new Date(2025, 7),
        slutt: new Date(2025, 10),
        tittel: 'Tilretteleggings- og medvirkningsplikt 2',
    },
    {
        start: new Date(2025, 7),
        slutt: new Date(2025, 9),
        tittel: 'Gjentagende sykefravær 2',
    },
    {
        start: new Date(2025, 9),
        slutt: new Date(2025, 11),
        tittel: 'Enda en greie 2',
    },
];

export const PlanGrafStory = ({ antallPølser, ...props }: PølsegrafProps & { antallPølser: number }) => (
    <div style={{ backgroundColor: "white", padding: "2rem", margin: "2rem", border: "1px solid lightgray", borderRadius: "1rem" }}>
        <PlanGraf
            {...props}
            pølser={dummyPølser.slice(0, antallPølser)}
        />
    </div>
)

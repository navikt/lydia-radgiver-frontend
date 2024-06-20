import { Meta } from "@storybook/react";
import PlanGraf, { PølsegrafProps } from "./PlanGraf";

export default {
    title: "Virksomhet/Plan",
    component: PlanGraf,
    parameters: {
        layout: 'fullscreen'
    },
    args: {
        periodStart: new Date(2024, 0),
        periodeSlutt: new Date(2025, 0),
        antallPølser: 4,
    },
    argTypes: {
        periodStart: {
            control: {
                type: 'date'
            }
        },
        periodeSlutt: {
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
        pølseStart: new Date(2024, 0),
        pølseSlutt: new Date(2024, 3),
        tittel: 'Sykefraværsrutiner',
    },
    {
        pølseStart: new Date(2024, 2),
        pølseSlutt: new Date(2024, 5),
        tittel: 'Oppfølgingssamtaler',
    },
    {
        pølseStart: new Date(2024, 7),
        pølseSlutt: new Date(2024, 10),
        tittel: 'Tilretteleggings- og medvirkningsplikt',
    },
    {
        pølseStart: new Date(2024, 7),
        pølseSlutt: new Date(2024, 9),
        tittel: 'Gjentagende sykefravær',
    },
    {
        pølseStart: new Date(2024, 9),
        pølseSlutt: new Date(2024, 11),
        tittel: 'Enda en greie',
    },
    {
        pølseStart: new Date(2025, 0),
        pølseSlutt: new Date(2025, 3),
        tittel: 'Sykefraværsrutiner 2',
    },
    {
        pølseStart: new Date(2025, 2),
        pølseSlutt: new Date(2025, 5),
        tittel: 'Oppfølgingssamtaler 2',
    },
    {
        pølseStart: new Date(2025, 7),
        pølseSlutt: new Date(2025, 10),
        tittel: 'Tilretteleggings- og medvirkningsplikt 2',
    },
    {
        pølseStart: new Date(2025, 7),
        pølseSlutt: new Date(2025, 9),
        tittel: 'Gjentagende sykefravær 2',
    },
    {
        pølseStart: new Date(2025, 9),
        pølseSlutt: new Date(2025, 11),
        tittel: 'Enda en greie 2',
    },
];

export const PlanGrafStory = ({antallPølser, ...props}: PølsegrafProps & {antallPølser: number}) => (
    <div style={{backgroundColor: "white", padding: "2rem", margin: "2rem", border: "1px solid lightgray",  borderRadius: "1rem"}}>
        <PlanGraf
        {...props}
        pølser={dummyPølser.slice(0, antallPølser)}
        />
    </div>
)

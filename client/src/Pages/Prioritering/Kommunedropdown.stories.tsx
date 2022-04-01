import {ComponentMeta} from "@storybook/react";
import {Kommunedropdown} from "./Kommunedropdown";

export default {
    title: "Kommune",
    component: Kommunedropdown,
} as ComponentMeta<typeof Kommunedropdown>;

export const Hovedstory = () => (<Kommunedropdown kommuneGroup={[
    {
        label: 'Viken',
        options: [
            {
                navn: "Haugenstua",
                nummer: "0195",
            },
            {
                navn: "Gika",
                nummer: "0222",
            },
            {
                navn: "Oslo",
                nummer: "0202"
            }
        ],
    },
    {
        label: 'Innlandet',
        options: [
            {
                navn: "Gjøvik",
                nummer: "1111",
            },
            {
                navn: "Broen",
                nummer: "1122",
            },
            {
                navn: "Erstad",
                nummer: "3333"
            }
        ]
    }
]} endreKommuner={console.log}/>)
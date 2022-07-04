import {ComponentMeta} from "@storybook/react";
import {Kommunedropdown} from "./Kommunedropdown";

export default {
    title: "Prioritering/Kommune",
    component: Kommunedropdown,
} as ComponentMeta<typeof Kommunedropdown>;

export const Hovedstory = () => (<Kommunedropdown relevanteFylkerMedKommuner={[
    {
        fylke: {
            navn: "Viken",
            nummer: "03"
        },
        kommuner: [
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
        fylke: {
            navn: "Innlandet",
            nummer: "05"
        },
        kommuner: [
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

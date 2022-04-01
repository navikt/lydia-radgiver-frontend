import {ComponentMeta} from "@storybook/react";
import {Kommunedropdown} from "./Kommunedropdown";

export default {
    title: "Kommune",
    component: Kommunedropdown,
} as ComponentMeta<typeof Kommunedropdown>;

export const Hovedstory = () => (<Kommunedropdown kommuner={[
    {
        navn: "Haugenstua",
        nummer: "0195",
    }, {
        navn: "Oslo",
        nummer: "0202"
    }
]} endreKommuner={console.log}/>)
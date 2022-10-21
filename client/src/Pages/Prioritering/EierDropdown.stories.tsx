import {ComponentMeta} from "@storybook/react";
import {Eier, EierDropdown} from "./EierDropdown";

export default {
    title: "Prioritering/Eierdropdown",
    component: EierDropdown,
} as ComponentMeta<typeof EierDropdown>


const EIERE_MOCKS: Eier[] = [
    {
        navn: "Donald Duck",
        id: "A12345"
    },
    {
        navn: "Fetter Anton",
        id: "B12345"
    },
    {
        navn: "Onkel Skrue",
        id: "C12345"
    },
    {
        navn: "Klara Ku",
        id: "D12345"
    },
    {
        navn: "Dolly Duck",
        id: "E12345"
    },
    {
        navn: "Langbein",
        id: "F12345"
    },
    {
        navn: "Mikke Mus",
        id: "G12345"
    },
]

export const Hovedstory = () => (<EierDropdown eierBytte={console.log} eiere={EIERE_MOCKS}/>)

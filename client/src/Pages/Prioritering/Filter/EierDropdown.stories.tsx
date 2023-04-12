import { Meta } from "@storybook/react";
import { EierDropdown } from "./EierDropdown";
import { EIERE_MOCKS } from "../mocks/filterverdierMock";

export default {
    title: "Prioritering/Eierdropdown",
    component: EierDropdown,
} as Meta<typeof EierDropdown>


export const Hovedstory = () => (<EierDropdown onEierBytteCallback={console.log} filtrerbareEiere={EIERE_MOCKS} />)

import { Meta } from "@storybook/react";
import { Leveranser } from "./Leveranser";
import { Leveranse } from "./Leveranse";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { iaSakViBistår } from "../mocks/iaSakMock";

const meta: Meta<typeof Leveranser> = {
    title: "Virksomhet/Leveranser/Leveranse",
    component: Leveranser,
}
export default meta;

export const Hovedstory = () => (
    <Leveranse leveranse={leveranserPerIATjeneste[0].leveranser[0]} iaSak={iaSakViBistår} />
)

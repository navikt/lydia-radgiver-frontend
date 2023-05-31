import { Meta, StoryObj } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { Leveranse } from "./Leveranse";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";

const meta = {
    title: "Virksomhet/Leveranser/Leveranse",
    component: Leveranse,
} satisfies Meta<typeof Leveranse>

export default meta;
type Story = StoryObj<typeof meta>

export const LeveranseUnderArbeid: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse: leveranserPerIATjeneste[0].leveranser[0],
    }
}

export const LeveranseLevert: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse: leveranserPerIATjeneste[0].leveranser[3],
    }
}

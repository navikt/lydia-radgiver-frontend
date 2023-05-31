import { Meta, StoryObj } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { LeveranseOversikt } from "./LeveranseOversikt";

const meta = {
    title: "Virksomhet/Leveranser/Leveranseoversikt",
    component: LeveranseOversikt,
} satisfies  Meta<typeof LeveranseOversikt>

export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        iaSak: iaSakViBistår
    }
}

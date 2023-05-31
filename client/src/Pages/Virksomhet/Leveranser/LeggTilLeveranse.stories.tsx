import { Meta, StoryObj } from "@storybook/react";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { iaSakViBistår } from "../mocks/iaSakMock";

const meta = {
    title: "Virksomhet/Leveranser/Legg til leveranse",
    component: LeggTilLeveranse,
} satisfies Meta<typeof LeggTilLeveranse>
export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        iaSak:iaSakViBistår,
    }
}

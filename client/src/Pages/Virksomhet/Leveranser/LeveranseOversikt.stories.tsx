import { Meta } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { LeveranseOversikt } from "./LeveranseOversikt";

const meta: Meta<typeof LeveranseOversikt> = {
    title: "Virksomhet/Leveranser/Leveranseoversikt",
    component: LeveranseOversikt,
}
export default meta;

export const Hovedstory = () => (
    <LeveranseOversikt iaSak={iaSakViBistår} />
)

import { Meta } from "@storybook/react";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { iaSakViBistår } from "../mocks/iaSakMock";

const meta: Meta<typeof LeggTilLeveranse> = {
    title: "Virksomhet/Leveranser/Legg til leveranse",
    component: LeggTilLeveranse,
}
export default meta;

export const Hovedstory = () => (
    <LeggTilLeveranse iaSak={iaSakViBistår} />
)

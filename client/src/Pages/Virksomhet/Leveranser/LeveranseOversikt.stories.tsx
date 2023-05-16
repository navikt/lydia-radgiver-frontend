import { Meta } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerMobilWrapper, SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";
import { LeveranseOversikt } from "./LeveranseOversikt";

const meta: Meta<typeof LeveranseOversikt> = {
    title: "Virksomhet/Leveranser/Leveranseoversikt",
    component: LeveranseOversikt,
}
export default meta;

export const Hovedstory = () => (
    <LeveranseOversikt iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <LeveranseOversikt iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

export const HovedstoryMobil = () => (
    <SimulerMobilWrapper>
        <LeveranseOversikt iaSak={iaSakViBistår} />
    </SimulerMobilWrapper>
)

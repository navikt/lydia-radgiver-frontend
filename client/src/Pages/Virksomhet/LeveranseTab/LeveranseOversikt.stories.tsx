import { ComponentMeta } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerMobilWrapper, SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";
import { LeveranseOversikt } from "./LeveranseOversikt";

export default {
    title: "Virksomhet/Leveranser/Leveranseoversikt",
    component: LeveranseOversikt,
} as ComponentMeta<typeof LeveranseOversikt>

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

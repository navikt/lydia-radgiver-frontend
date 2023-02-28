import { ComponentMeta } from "@storybook/react";
import { LeveranseTab } from "./LeveranseTab";
import { iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Leveranser/Leveransefane",
    component: LeveranseTab,
} as ComponentMeta<typeof LeveranseTab>

export const Hovedstory = () => (
    <LeveranseTab iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <LeveranseTab iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

export const SakErIkkeIViBistaar = () => (
    <LeveranseTab iaSak={iaSakKartlegges} />
)

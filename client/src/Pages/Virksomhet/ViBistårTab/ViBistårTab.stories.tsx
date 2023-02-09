import { ViBistårTab } from "./ViBistårTab";
import { ComponentMeta } from "@storybook/react";
import { iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Vi bistår/Vi bistår-tab",
    component: ViBistårTab,
} as ComponentMeta<typeof ViBistårTab>

export const Hovedstory = () => (
    <ViBistårTab iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <ViBistårTab iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

export const SakErIkkeIViBistaar = () => (
    <ViBistårTab iaSak={iaSakKartlegges} />
)

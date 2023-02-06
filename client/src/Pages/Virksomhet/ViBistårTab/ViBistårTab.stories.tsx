import { ViBistårTab } from "./ViBistårTab";
import { ComponentMeta } from "@storybook/react";
import { iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";

export default {
    title: "Virksomhet/Vi bistår/Vi bistår-tab",
    component: ViBistårTab,
} as ComponentMeta<typeof ViBistårTab>

export const Hovedstory = () => (
    <ViBistårTab iaSak={iaSakViBistår}/>
)

export const SakErIkkeIViBistaar = () => (
    <ViBistårTab iaSak={iaSakKartlegges}/>
)

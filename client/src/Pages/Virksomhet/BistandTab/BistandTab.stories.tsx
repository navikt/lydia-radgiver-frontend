import { ComponentMeta } from "@storybook/react";
import { BistandTab } from "./BistandTab";
import { iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Bistand/Bistandsfane",
    component: BistandTab,
} as ComponentMeta<typeof BistandTab>

export const Hovedstory = () => (
    <BistandTab iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <BistandTab iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

export const SakErIkkeIViBistaar = () => (
    <BistandTab iaSak={iaSakKartlegges} />
)

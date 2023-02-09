import { ComponentMeta } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { NyIALeveranseSkjema } from "./NyIALeveranseSkjema";
import { SimulerMobilWrapper, SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Vi bistår/Ny IA-leveranse-skjema",
    component: NyIALeveranseSkjema,
} as ComponentMeta<typeof NyIALeveranseSkjema>

export const Hovedstory = () => (
    <NyIALeveranseSkjema iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <NyIALeveranseSkjema iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

export const HovedstoryMobil = () => (
    <SimulerMobilWrapper>
        <NyIALeveranseSkjema iaSak={iaSakViBistår} />
    </SimulerMobilWrapper>
)

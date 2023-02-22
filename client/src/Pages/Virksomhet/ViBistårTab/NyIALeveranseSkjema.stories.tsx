import { ComponentMeta } from "@storybook/react";
import { NyIALeveranseSkjema } from "./NyIALeveranseSkjema";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerMobilWrapper, SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Bistand/Ny IA-leveranse-skjema",
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

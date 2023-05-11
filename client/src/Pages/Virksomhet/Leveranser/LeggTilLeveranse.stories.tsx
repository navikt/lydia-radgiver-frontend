import { ComponentMeta } from "@storybook/react";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerMobilWrapper, SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Leveranser/Legg til leveranse",
    component: LeggTilLeveranse,
} as ComponentMeta<typeof LeggTilLeveranse>

export const Hovedstory = () => (
    <LeggTilLeveranse iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <LeggTilLeveranse iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

export const HovedstoryMobil = () => (
    <SimulerMobilWrapper>
        <LeggTilLeveranse iaSak={iaSakViBistår} />
    </SimulerMobilWrapper>
)

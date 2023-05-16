import { Meta } from "@storybook/react";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerMobilWrapper, SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

const meta: Meta<typeof LeggTilLeveranse> = {
    title: "Virksomhet/Leveranser/Legg til leveranse",
    component: LeggTilLeveranse,
}
export default meta;

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

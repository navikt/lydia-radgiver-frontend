import { ComponentMeta } from "@storybook/react";
import { Leveranser } from "./Leveranser";
import { Leveranse } from "./Leveranse";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Leveranser/Leveranse",
    component: Leveranser,
} as ComponentMeta<typeof Leveranse>

export const Hovedstory = () => (
    <Leveranse leveranse={leveranserPerIATjeneste[0].leveranser[0]} iaSak={iaSakViBistår} />
)

export const LevertLeveranse = () => (
    <Leveranse leveranse={leveranserPerIATjeneste[0].leveranser[3]} iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <Leveranse leveranse={leveranserPerIATjeneste[0].leveranser[0]} iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

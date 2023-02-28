import { ComponentMeta } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { IATjeneste } from "./IATjeneste";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Leveranser/Leveranser per IATjeneste",
    component: IATjeneste,
} as ComponentMeta<typeof IATjeneste>

export const Hovedstory = () => (
    <IATjeneste iaSak={iaSakViBistår} iaTjenesteMedLeveranser={leveranserPerIATjeneste[0]} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <IATjeneste iaSak={iaSakViBistår} iaTjenesteMedLeveranser={leveranserPerIATjeneste[0]} />
    </SimulerTabletWrapper>
)

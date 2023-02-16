import { ComponentMeta } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { IATjeneste } from "./IATjeneste";
import { iaSakLeveranser } from "../mocks/iaSakLeveranseMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Vi bistår/Leveranser per IATjeneste",
    component: IATjeneste,
} as ComponentMeta<typeof IATjeneste>

export const Hovedstory = () => (
    <IATjeneste iaSak={iaSakViBistår} iaTjenesteMedLeveranser={iaSakLeveranser[0]} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <IATjeneste iaSak={iaSakViBistår} iaTjenesteMedLeveranser={iaSakLeveranser[0]} />
    </SimulerTabletWrapper>
)

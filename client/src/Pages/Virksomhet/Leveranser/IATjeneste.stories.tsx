import { Meta } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { IATjeneste } from "./IATjeneste";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

const meta: Meta<typeof IATjeneste> = {
    title: "Virksomhet/Leveranser/Leveranser per IATjeneste",
    component: IATjeneste,
}
export default meta;

export const Hovedstory = () => (
    <IATjeneste iaSak={iaSakViBistår} iaTjenesteMedLeveranser={leveranserPerIATjeneste[0]} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <IATjeneste iaSak={iaSakViBistår} iaTjenesteMedLeveranser={leveranserPerIATjeneste[0]} />
    </SimulerTabletWrapper>
)

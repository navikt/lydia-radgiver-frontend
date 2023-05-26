import { Meta, StoryObj } from "@storybook/react";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { IATjeneste } from "./IATjeneste";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

const meta = {
    title: "Virksomhet/Leveranser/Leveranser per IATjeneste",
    component: IATjeneste,
} satisfies Meta<typeof IATjeneste>

export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        iaSak: iaSakViBistår,
        iaTjenesteMedLeveranser: leveranserPerIATjeneste[0],
    },
}

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <IATjeneste iaSak={iaSakViBistår} iaTjenesteMedLeveranser={leveranserPerIATjeneste[0]} />
    </SimulerTabletWrapper>
)

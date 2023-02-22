import { ComponentMeta } from "@storybook/react";
import { BistandTab } from "./BistandTab";
import { IASakLeveranse } from "./IASakLeveranse";
import { iaSakLeveranser } from "../mocks/iaSakLeveranseMock";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Bistand/IASakLeveranse",
    component: BistandTab,
} as ComponentMeta<typeof IASakLeveranse>

export const Hovedstory = () => (
    <IASakLeveranse leveranse={iaSakLeveranser[0].leveranser[0]} iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <IASakLeveranse leveranse={iaSakLeveranser[0].leveranser[0]} iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

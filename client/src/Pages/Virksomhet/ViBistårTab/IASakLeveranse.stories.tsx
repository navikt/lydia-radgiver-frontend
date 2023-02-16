import { ViBistårTab } from "./ViBistårTab";
import { ComponentMeta } from "@storybook/react";
import { IASakLeveranse } from "./IASakLeveranse";
import { iaSakLeveranser } from "../mocks/iaSakLeveranseMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";
import { iaSakViBistår } from "../mocks/iaSakMock";

export default {
    title: "Virksomhet/Vi bistår/IASakLeveranse",
    component: ViBistårTab,
} as ComponentMeta<typeof IASakLeveranse>

export const Hovedstory = () => (
    <IASakLeveranse leveranse={iaSakLeveranser[0].leveranser[0]} iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <IASakLeveranse leveranse={iaSakLeveranser[0].leveranser[0]} iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

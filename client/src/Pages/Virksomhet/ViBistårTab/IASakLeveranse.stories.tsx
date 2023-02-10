import { ViBistårTab } from "./ViBistårTab";
import { ComponentMeta } from "@storybook/react";
import { IASakLeveranse } from "./IASakLeveranse";
import { iaSakLeveranser, IATjenester } from "../mocks/iaSakLeveranseMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";
import { Heading } from "@navikt/ds-react";

export default {
    title: "Virksomhet/Vi bistår/IASakLeveranse",
    component: ViBistårTab,
} as ComponentMeta<typeof IASakLeveranse>

export const Hovedstory = () => (
    <IASakLeveranse leveranse={iaSakLeveranser[0]} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <IASakLeveranse leveranse={iaSakLeveranser[0]} />
    </SimulerTabletWrapper>
)

export const AlleLeveranser = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {iaSakLeveranser.map((leveranse) =>
            <IASakLeveranse leveranse={leveranse} key={leveranse.id} />
        )}
    </div>
)

export const AlleLeveranserEtterIATjeneste = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {IATjenester.map((tjeneste) => (
            <div key={tjeneste.id}>
                <Heading size="small" key={tjeneste.id}>{tjeneste.navn}</Heading>
                {iaSakLeveranser
                    .filter((leveranse) => leveranse.modul.iaTjeneste.id === (tjeneste.id))
                    .map((leveranse) =>
                        <IASakLeveranse leveranse={leveranse} key={leveranse.id} />)}
            </div>
        ))}
    </div>
)

export const AlleLeveranserEtterIATjenesteTablet = () => (
    <SimulerTabletWrapper>
        <AlleLeveranserEtterIATjeneste />
    </SimulerTabletWrapper>
)

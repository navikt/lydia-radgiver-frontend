import { ComponentMeta } from "@storybook/react";
import { Leveranser } from "./Leveranser";
import { iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";
import { brukerSomErSaksbehandler } from "../../Prioritering/mocks/innloggetAnsattMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Leveranser/Leveransefane",
    component: Leveranser,
} as ComponentMeta<typeof Leveranser>

export const Hovedstory = () => (
    <Leveranser iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <Leveranser iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

export const BrukerEierIkkeSak = () => {
    const sakEidAvAnnaBruker = { ...iaSakViBistår, eidAv: brukerSomErSaksbehandler.ident};

    return <Leveranser iaSak={sakEidAvAnnaBruker}/>
}

export const SakErIkkeIViBistaar = () => (
    <Leveranser iaSak={iaSakKartlegges} />
)

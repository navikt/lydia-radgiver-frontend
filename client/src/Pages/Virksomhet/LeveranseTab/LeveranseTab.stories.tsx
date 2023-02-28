import { ComponentMeta } from "@storybook/react";
import { LeveranseTab } from "./LeveranseTab";
import { iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";
import { brukerSomErSaksbehandler } from "../../Prioritering/mocks/innloggetAnsattMock";
import { SimulerTabletWrapper } from "../../../../.storybook/SkjermstørrelseSimuleringer";

export default {
    title: "Virksomhet/Leveranser/Leveransefane",
    component: LeveranseTab,
} as ComponentMeta<typeof LeveranseTab>

export const Hovedstory = () => (
    <LeveranseTab iaSak={iaSakViBistår} />
)

export const HovedstoryTablet = () => (
    <SimulerTabletWrapper>
        <LeveranseTab iaSak={iaSakViBistår} />
    </SimulerTabletWrapper>
)

export const BrukerEierIkkeSak = () => {
    const sakEidAvAnnaBruker = { ...iaSakViBistår, eidAv: brukerSomErSaksbehandler.ident};

    return <LeveranseTab iaSak={sakEidAvAnnaBruker}/>
}

export const SakErIkkeIViBistaar = () => (
    <LeveranseTab iaSak={iaSakKartlegges} />
)

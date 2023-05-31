import { Meta } from "@storybook/react";
import { Leveranser } from "./Leveranser";
import { iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";
import { brukerSomErSaksbehandler } from "../../Prioritering/mocks/innloggetAnsattMock";

const meta: Meta<typeof Leveranser> = {
    title: "Virksomhet/Leveranser/Leveransefane",
    component: Leveranser,
}
export default meta;

export const Hovedstory = () => (
    <Leveranser iaSak={iaSakViBistår} />
)

export const BrukerEierIkkeSak = () => {
    const sakEidAvAnnaBruker = { ...iaSakViBistår, eidAv: brukerSomErSaksbehandler.ident};

    return <Leveranser iaSak={sakEidAvAnnaBruker}/>
}

export const SakErIkkeIViBistaar = () => (
    <Leveranser iaSak={iaSakKartlegges} />
)

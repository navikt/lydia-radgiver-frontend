import { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { Leveranse } from "./Leveranse";
import { Leveranse as LeveranseType } from "../../../domenetyper/leveranse"
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { brukerSomHarLesetilgang } from "../../Prioritering/mocks/innloggetAnsattMock";
import { mswHandlers } from "../../../../.storybook/mswHandlers";
import { innloggetAnsattPath } from "../../../api/lydia-api";

const meta = {
    title: "Virksomhet/Leveranser/Leveranse",
    component: Leveranse,
} satisfies Meta<typeof Leveranse>

export default meta;
type Story = StoryObj<typeof meta>

const stigendeEtterId = (a: LeveranseType, b: LeveranseType) => {
    return a.id - b.id;
}

export const LeveranseUnderArbeid: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse: leveranserPerIATjeneste[0].leveranser.sort(stigendeEtterId)[0],
    }
}

export const LeveranseLevert: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse: leveranserPerIATjeneste[0].leveranser.sort(stigendeEtterId)[3],
    }
}

export const BrukerErLesebruker: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse: leveranserPerIATjeneste[0].leveranser.sort(stigendeEtterId)[3],
    },
    parameters: {
        msw: [
            rest.get(innloggetAnsattPath, (req, res, ctx) => {
                return res(ctx.json(brukerSomHarLesetilgang));
            }),
            ...mswHandlers,
        ]
    }
}

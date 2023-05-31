import { Meta, StoryObj } from "@storybook/react";
import { Leveranser } from "./Leveranser";
import { iaSakFullført, iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";
import { brukerSomErSaksbehandler, brukerSomHarLesetilgang } from "../../Prioritering/mocks/innloggetAnsattMock";
import { rest } from "msw";
import { mswHandlers } from "../../../../.storybook/mswHandlers";

const meta = {
    title: "Virksomhet/Leveranser/Leveransefane",
    component: Leveranser,
} satisfies Meta<typeof Leveranser>
export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        iaSak: iaSakViBistår
    }
}

export const BrukerEierIkkeSak: Story = {
    args: {
        iaSak: {...iaSakViBistår, eidAv: brukerSomErSaksbehandler.ident}
    }
}

export const SakErIkkeIViBistaar: Story = {
    args: {
        iaSak: iaSakKartlegges
    }
}

export const SakErIFullført: Story = {
    args: {
        iaSak: iaSakFullført
    }
}

export const BrukerHarLesetilgang: Story = {
    args: {
        iaSak: iaSakFullført
    },
    parameters: {
        msw: [
            rest.get('/innloggetAnsatt', (req, res, ctx) => {
                return res(ctx.json(brukerSomHarLesetilgang));
            }),
            ...mswHandlers,
        ]
    }
}

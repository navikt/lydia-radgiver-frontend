import { Meta, StoryObj } from "@storybook/react";
import { LeveranseFane } from "./LeveranseFane";
import { iaSakFullført, iaSakKartlegges, iaSakViBistår } from "../mocks/iaSakMock";
import { brukerSomErSaksbehandler, brukerSomHarLesetilgang } from "../../Prioritering/mocks/innloggetAnsattMock";
import { rest } from "msw";
import { mswHandlers } from "../../../../.storybook/mswHandlers";
import { iaSakPath, innloggetAnsattPath } from "../../../api/lydia-api";

const meta = {
    title: "Virksomhet/Leveranser/Leveransefane",
    component: LeveranseFane,
} satisfies Meta<typeof LeveranseFane>
export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        iaSak: iaSakViBistår
    },
    parameters: {
        msw: [
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakViBistår));
            }),
            ...mswHandlers,
        ]
    }
}

export const BrukerEierIkkeSak: Story = {
    args: {
        iaSak: {...iaSakViBistår, eidAv: brukerSomErSaksbehandler.ident}
    },
    parameters: {
        msw: [
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json({...iaSakViBistår, eidAv: brukerSomErSaksbehandler.ident}));
            }),
            ...mswHandlers,
        ]
    }
}

export const SakErIkkeIViBistaar: Story = {
    args: {
        iaSak: iaSakKartlegges
    },
    parameters: {
        msw: [
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakKartlegges));
            }),
            ...mswHandlers,
        ]
    }
}

export const SakErIFullført: Story = {
    args: {
        iaSak: iaSakFullført
    },
    parameters: {
        msw: [
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakFullført));
            }),
            ...mswHandlers,
        ]
    }
}

export const BrukerHarLesetilgang: Story = {
    args: {
        iaSak: iaSakFullført
    },
    parameters: {
        msw: [
            rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                return res(ctx.json(iaSakFullført));
            }),
            rest.get(innloggetAnsattPath, (req, res, ctx) => {
                return res(ctx.json(brukerSomHarLesetilgang));
            }),
            ...mswHandlers,
        ]
    }
}

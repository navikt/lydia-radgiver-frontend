import { Meta, StoryObj } from "@storybook/react";
import { LeveranseFane } from "./LeveranseFane";
import {
    iaSakFullført,
    iaSakKartlegges,
    iaSakViBistår,
} from "../mocks/iaSakMock";
import {
    brukerSomErSaksbehandler,
    brukerSomHarLesetilgang,
} from "../../Prioritering/mocks/innloggetAnsattMock";
import { http, HttpResponse } from "msw";
import { mswHandlers } from "../../../../.storybook/mswHandlers";
import { iaSakPath, innloggetAnsattPath } from "../../../api/lydia-api/paths";

const meta = {
    title: "Virksomhet/Leveranser/Leveransefane",
    component: LeveranseFane,
} satisfies Meta<typeof LeveranseFane>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Hovedstory: Story = {
    args: {
        iaSak: iaSakViBistår,
    },
    parameters: {
        msw: [
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakViBistår);
            }),
            ...mswHandlers,
        ],
    },
};

export const BrukerEierIkkeSak: Story = {
    args: {
        iaSak: { ...iaSakViBistår, eidAv: brukerSomErSaksbehandler.ident },
    },
    parameters: {
        msw: [
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json({
                    ...iaSakViBistår,
                    eidAv: brukerSomErSaksbehandler.ident,
                });
            }),
            ...mswHandlers,
        ],
    },
};

export const SakErIkkeIViBistaar: Story = {
    args: {
        iaSak: iaSakKartlegges,
    },
    parameters: {
        msw: [
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakKartlegges);
            }),
            ...mswHandlers,
        ],
    },
};

export const SakErIFullført: Story = {
    args: {
        iaSak: iaSakFullført,
    },
    parameters: {
        msw: [
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakFullført);
            }),
            ...mswHandlers,
        ],
    },
};

export const BrukerHarLesetilgang: Story = {
    args: {
        iaSak: iaSakFullført,
    },
    parameters: {
        msw: [
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakFullført);
            }),
            http.get(innloggetAnsattPath, () => {
                return HttpResponse.json(brukerSomHarLesetilgang);
            }),
            ...mswHandlers,
        ],
    },
};

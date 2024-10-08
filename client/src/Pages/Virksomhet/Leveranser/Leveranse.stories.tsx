import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { iaSakViBistår } from "../mocks/iaSakMock";
import { Leveranse } from "./Leveranse";
import { Leveranse as LeveranseType } from "../../../domenetyper/leveranse";
import { leveranserPerIATjeneste } from "../mocks/leveranseMock";
import { brukerSomHarLesetilgang } from "../../Prioritering/mocks/innloggetAnsattMock";
import { mswHandlers } from "../../../../.storybook/mswHandlers";
import { iaSakPath, innloggetAnsattPath } from "../../../api/lydia-api";

const meta = {
    title: "Virksomhet/Leveranser/Leveranse",
    component: Leveranse,
} satisfies Meta<typeof Leveranse>;

export default meta;
type Story = StoryObj<typeof meta>;

const stigendeEtterId = (a: LeveranseType, b: LeveranseType) => {
    return a.id - b.id;
};

export const LeveranseUnderArbeid: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse:
            leveranserPerIATjeneste[0].leveranser.sort(stigendeEtterId)[0],
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

export const LeveranseLevert: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse:
            leveranserPerIATjeneste[0].leveranser.sort(stigendeEtterId)[3],
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

export const BrukerErLesebruker: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse:
            leveranserPerIATjeneste[0].leveranser.sort(stigendeEtterId)[3],
    },
    parameters: {
        msw: [
            http.get(`${iaSakPath}/:orgnummer/aktiv`, () => {
                return HttpResponse.json(iaSakViBistår);
            }),
            http.get(innloggetAnsattPath, () => {
                return HttpResponse.json(brukerSomHarLesetilgang);
            }),
            ...mswHandlers,
        ],
    },
};

export const DeaktivertLeveranse: Story = {
    args: {
        iaSak: iaSakViBistår,
        leveranse:
            leveranserPerIATjeneste[0].leveranser.sort(stigendeEtterId)[3],
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

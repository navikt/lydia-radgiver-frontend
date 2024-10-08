import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { SamarbeidshistorikkFane } from "./SamarbeidshistorikkFane";
import { samarbeidshistorikkMock } from "../mocks/iaSakHistorikkMock";
import { iaSakHistorikkPath } from "../../../api/lydia-api";
import { mswHandlers } from "../../../../.storybook/mswHandlers";

const meta = {
    title: "Virksomhet/Samarbeidshistorikkfane",
    component: SamarbeidshistorikkFane,
} satisfies Meta<typeof SamarbeidshistorikkFane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlereSaker: Story = {
    args: {
        orgnr: "123456789",
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${iaSakHistorikkPath}/:orgnummer`, () => {
                    return HttpResponse.json(samarbeidshistorikkMock);
                }),
                ...mswHandlers,
            ],
        },
    },
};

export const IngenSaker: Story = {
    args: { ...FlereSaker.args },
    parameters: {
        msw: {
            handlers: [
                http.get(`${iaSakHistorikkPath}/:orgnummer`, () => {
                    return HttpResponse.json([]);
                }),
            ],
        },
    },
};

export const LasterSaker: Story = {
    args: { ...FlereSaker.args },
    parameters: {
        msw: {
            handlers: [
                http.get(`${iaSakHistorikkPath}/:orgnummer`, async () => {
                    await new Promise((resolve) => setTimeout(resolve, 3000));

                    return HttpResponse.json([]);
                }),
            ],
        },
    },
};
export const FeilVedLastingAvSaker: Story = {
    args: { ...FlereSaker.args },
    parameters: {
        msw: {
            handlers: [
                http.get(`${iaSakHistorikkPath}/:orgnummer`, () => {
                    return HttpResponse.json(undefined);
                }),
            ],
        },
    },
};

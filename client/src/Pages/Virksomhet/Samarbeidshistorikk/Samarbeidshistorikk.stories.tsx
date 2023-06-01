import { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { Samarbeidshistorikk } from "./Samarbeidshistorikk";
import { samarbeidshistorikkMock } from "../mocks/iaSakHistorikkMock";
import { iaSakHistorikkPath } from "../../../api/lydia-api";

const meta = {
    title: "Virksomhet/Samarbeidshistorikk for en IA-sak",
    component: Samarbeidshistorikk,
} satisfies Meta<typeof Samarbeidshistorikk>;

export default meta;
type Story = StoryObj<typeof meta>

export const FlereSaker: Story = {
    args: {
        orgnr: "123456789"
    },
    parameters: {
        msw: {
            handlers: [
                rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
                    return res(
                        ctx.json(samarbeidshistorikkMock)
                    );
                }),
            ],
        },
    },
};

export const IngenSaker: Story = {
    args: {...FlereSaker.args},
    parameters: {
        msw: {
            handlers: [
                rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
                    return res(
                        ctx.json([])
                    );
                }),
            ],
        },
    },
};

export const LasterSaker: Story = {
    args: {...FlereSaker.args},
    parameters: {
        msw: {
            handlers: [
                rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
                    return new Promise(resolve => setTimeout(resolve, 3000))
                        .then(() => res(
                            ctx.json([])
                        ))
                }),
            ],
        },
    },
};
export const FeilVedLastingAvSaker: Story = {
    args: {...FlereSaker.args},
    parameters: {
        msw: {
            handlers: [
                rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
                    return res(
                        ctx.json(undefined)
                    );
                }),
            ],
        },
    },
};

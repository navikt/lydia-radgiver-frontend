import { ComponentMeta } from "@storybook/react";
import { Samarbeidshistorikk } from "./Samarbeidshistorikk";
import { samarbeidshistorikkMock } from "../mocks/iaSakHistorikkMock";
import { rest } from "msw";
import { iaSakHistorikkPath } from "../../../api/lydia-api";

export default {
    title: "Virksomhet/Samarbeidshistorikk for en IA-sak",
    component: Samarbeidshistorikk,
} as ComponentMeta<typeof Samarbeidshistorikk>;

export const FlereSaker = () => (
    <Samarbeidshistorikk orgnr="123456789" />
);

export const IngenSaker = () => (
    <Samarbeidshistorikk orgnr="123456789" />
);

export const LasterSaker = () => (
    <Samarbeidshistorikk orgnr="123456789" />
);

export const FeilVedLastingAvSaker = () => (
    <Samarbeidshistorikk orgnr="123456789" />
);

FlereSaker.parameters = {
    msw: {
        handlers: [
            rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
                return res(
                    ctx.json(samarbeidshistorikkMock)
                );
            }),
        ],
    },
};

IngenSaker.parameters = {
    msw: {
        handlers: [
            rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
                return res(
                    ctx.json([])
                );
            }),
        ],
    },
};

LasterSaker.parameters = {
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
};

FeilVedLastingAvSaker.parameters = {
    msw: {
        handlers: [
            rest.get(`${iaSakHistorikkPath}/:orgnummer`, (req, res, ctx) => {
                return res(
                    ctx.json(undefined)
                );
            }),
        ],
    },
};

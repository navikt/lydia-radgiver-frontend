import { Meta, StoryObj } from "@storybook/react";
import { fjernetVirksomhetMock, slettetVirksomhetMock, virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import { VirksomhetsVisning } from "./VirksomhetsVisning";
import { rest } from "msw";
import { iaSakPath } from "../../api/lydia-api";
import { iaSakFullførtOgLukket, iaSakKontaktes } from "./mocks/iaSakMock";

const meta = {
    title: "Virksomhet/Visning av en virksomhet",
    component: VirksomhetsVisning,
} satisfies Meta<typeof VirksomhetsVisning>

export default meta;
type Story = StoryObj<typeof meta>

export const Hovedstory: Story = {
    args: {
        virksomhet: virksomhetMock,
    },
};

Hovedstory.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                    return res(ctx.json(iaSakKontaktes));
                })
            ],
        }
    },
};


export const VirksomhetSomErSlettet: Story = {
    args: {
        virksomhet: slettetVirksomhetMock
    }
};

VirksomhetSomErSlettet.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                    return res(ctx.json(iaSakKontaktes));
                })
            ],
        }
    },
};


export const VirksomhetSomErFjernet: Story = {
    args: {
        virksomhet: fjernetVirksomhetMock
    }
};

VirksomhetSomErFjernet.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                    return res(ctx.json(iaSakKontaktes));
                })
            ],
        }
    },
};


export const VirksomhetMedSakSomErLukket: Story = {
    args: {
        virksomhet: virksomhetMock
    }
};

VirksomhetMedSakSomErLukket.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                    return res(ctx.json(iaSakFullførtOgLukket));
                })
            ],
        }
    },
};


export const VirksomhetUtenSak: Story = {
    args: {
        virksomhet: virksomhetMock
    }
};

VirksomhetUtenSak.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(`${iaSakPath}/:orgnummer/aktiv`, (req, res, ctx) => {
                    return res(ctx.status(204));
                })
            ],
        }
    },
};

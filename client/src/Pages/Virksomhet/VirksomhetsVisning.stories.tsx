import { ComponentMeta } from "@storybook/react";
import { fjernetVirksomhetMock, slettetVirksomhetMock, virksomhetMock } from "../Prioritering/mocks/virksomhetMock";
import { VirksomhetsVisning } from "./VirksomhetsVisning";
import { rest } from "msw";
import { iaSakPath } from "../../api/lydia-api";
import { iaSakFullførtOgLukket, iaSakKontaktes } from "./mocks/iaSakMock";

export default {
    title: "Virksomhet/Visning av en virksomhet",
    component: VirksomhetsVisning,
} as ComponentMeta<typeof VirksomhetsVisning>;

export const Hovedstory = () => (
    <VirksomhetsVisning
        virksomhet={virksomhetMock}
    />
);

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

export const VirksomhetSomErSlettet = () => (
    <VirksomhetsVisning
        virksomhet={slettetVirksomhetMock}
    />
);

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

export const VirksomhetSomErFjernet = () => (
    <VirksomhetsVisning
        virksomhet={fjernetVirksomhetMock}
    />
);

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

export const VirksomhetMedSakSomErLukket = () => (
    <VirksomhetsVisning
        virksomhet={virksomhetMock}
    />
);

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

export const VirksomhetUtenSak = () => (
    <VirksomhetsVisning
        virksomhet={virksomhetMock}
    />
);

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